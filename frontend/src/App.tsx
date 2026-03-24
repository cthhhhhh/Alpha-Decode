import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Search, Gamepad2, Star, Flame, Shield, ChevronUp } from 'lucide-react';
import type { Lesson, RevisionQuiz, RevisionQuizQuestion } from './types';

import Header from './components/Header';
import DailyWord from './components/DailyWord';
import LessonPath from './components/LessonPath';
import LessonSession from './components/LessonSession';
import OnboardingModal from './components/OnboardingModal';
import DailyQuizModal from './components/DailyQuizModal';
import RevisionQuizModal from './components/RevisionQuizModal';
import Glossary from './components/Glossary';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Auth State ---
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [authRole, setAuthRole] = useState<string | null>(() => localStorage.getItem('role'));
  const [authUsername, setAuthUsername] = useState<string | null>(() => localStorage.getItem('username'));

  // --- Active Tab State (derived from URL) ---
  const isLeaderboard = location.pathname.startsWith('/leaderboard');
  const isGlossary = location.pathname.startsWith('/glossary');
  const isLearn = !isLeaderboard && !isGlossary;
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp') || '0'));
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('level') || '1'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('streak') || '0'));
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(() => {
    const saved = localStorage.getItem('dailyQuizDate');
    return saved === new Date().toDateString();
  });
  const [dailyQuizStarted, setDailyQuizStarted] = useState(() => {
    const saved = localStorage.getItem('dailyQuizStartedDate');
    return saved === new Date().toDateString();
  });
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [revisionQuizzes, setRevisionQuizzes] = useState<RevisionQuiz[]>([]);
  const [completedRevisionIds, setCompletedRevisionIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('completedRevisionQuizIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [activeRevisionQuiz, setActiveRevisionQuiz] = useState<RevisionQuiz | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Show onboarding if they haven't finished it OR if they explicitly visit the root URL
    return localStorage.getItem('onboardingFinished') !== 'true';
  });
  const [onboardingQIndex, setOnboardingQIndex] = useState(0);
  const [onboardingScore, setOnboardingScore] = useState(0);
  const [onboardingFinished, setOnboardingFinished] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  // { q, options, correct } shaped for modals
  type QuizQ = { q: string; options: string[]; correct: number; explanation: string };
  type OnbQ = { q: string; options: string[]; correct: number };
  const [dailyQuizQuestions, setDailyQuizQuestions] = useState<QuizQ[]>([]);
  const [onboardingQuestions, setOnboardingQuestions] = useState<OnbQ[]>([]);
  // DB lesson id → 1-based position for Glossary
  const [lessonIdToPosition, setLessonIdToPosition] = useState<Record<string, number>>({});

  // Fetch lesson list from backend on mount
  useEffect(() => {
    fetch('/api/lessons/')
      .then(r => r.json())
      .then((data: { id: number; title: string }[]) => {
        const xOffsets = [0, 40, -40, 0, 40, -40, 0];
        const pos: Record<string, number> = {};
        data.forEach((l, i) => { pos[String(l.id)] = i + 1; });
        setLessonIdToPosition(pos);

        const isAdmin = authRole === 'ADMIN';
        const unlockedIndex = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');

        setLessons(data.map((l, i) => ({
          id: String(l.id),
          title: l.title,
          locked: isAdmin ? false : i > unlockedIndex,
          completed: isAdmin ? true : i < unlockedIndex,
          x: xOffsets[i % xOffsets.length],
        })));
      })
      .catch(() => setLessons([]));
  }, [authToken, authRole]);

  // Fetch daily quiz questions
  useEffect(() => {
    fetch('/api/quiz/daily')
      .then(r => r.json())
      .then((data: { title: string; options: string[]; correctAnswer: number; explanation: string }[]) =>
        setDailyQuizQuestions(data.map(q => ({ q: q.title, options: q.options, correct: q.correctAnswer, explanation: q.explanation })))
      ).catch(() => { });
  }, []);

  // Fetch revision quizzes
  useEffect(() => {
    fetch('/api/quiz/revision')
      .then(r => r.json())
      .then((data: { id: number; afterLessonIndex: number; questions: RevisionQuizQuestion[] }[]) =>
        setRevisionQuizzes(data.map(rq => ({
          id: String(rq.id),
          afterLessonIndex: rq.afterLessonIndex,
          questions: rq.questions,
        })))
      ).catch(() => {});
  }, []);

  // Fetch onboarding questions
  useEffect(() => {
    fetch('/api/quiz/onboarding')
      .then(r => r.json())
      .then((data: { title: string; options: string[]; correctAnswer: number }[]) =>
        setOnboardingQuestions(data.map(q => ({ q: q.title, options: q.options, correct: q.correctAnswer })))
      ).catch(() => { });
  }, []);

  const handleAuthSuccess = (token: string, role: string, username: string, level?: number, xp?: number, maxUnlockedLessonIndex?: number) => {
    setAuthToken(token);
    setAuthRole(role);
    setAuthUsername(username);
    if (level !== undefined) {
      setLevel(level);
      localStorage.setItem('level', level.toString());
    }
    if (xp !== undefined) {
      setXp(xp);
      localStorage.setItem('xp', xp.toString());
    }
    if (maxUnlockedLessonIndex !== undefined) {
      localStorage.setItem('maxUnlockedLessonIndex', maxUnlockedLessonIndex.toString());
      // Re-trigger useEffect lesson fetching based on updated localStorage
      const idx = maxUnlockedLessonIndex;
      setLessons(prev => prev.map((l, i) => ({
        ...l,
        locked: i > idx,
        completed: i < idx
      })));
    }
    setShowOnboarding(false);
    localStorage.setItem('onboardingFinished', 'true');
    navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('xp');
    localStorage.removeItem('level');
    localStorage.removeItem('streak');
    // NOTE: dailyQuizDate and dailyQuizStartedDate are intentionally kept
    // so the quiz lock persists across same-day re-logins.
    localStorage.removeItem('completedRevisionQuizIds');
    localStorage.removeItem('maxUnlockedLessonIndex');
    setAuthToken(null);
    setAuthRole(null);
    setAuthUsername(null);
    setXp(0);
    setLevel(1);
    navigate('/login');
  };

  // --- Handlers ---

  const handleDailyQuizComplete = (correct: number, total: number) => {
    if (correct === total) {
      const newXp = xp + 10;
      const newStreak = streak + 1;
      setXp(newXp);
      setStreak(newStreak);
      localStorage.setItem('xp', newXp.toString());
      localStorage.setItem('streak', newStreak.toString());
      // Persist XP bonus to backend
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/auth/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ xpToAdd: 10 }),
        }).catch(err => console.error('Failed to save quiz XP:', err));
      }
    }
    localStorage.setItem('dailyQuizDate', new Date().toDateString());
    setDailyQuizCompleted(true);
    setShowDailyQuiz(false);
  };

  const handleRevisionQuizComplete = (quizId: string, correct: number, _total: number) => {
    const alreadyDone = completedRevisionIds.has(quizId);
    if (!alreadyDone && correct > 0) {
      const newXp = xp + correct;
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/auth/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ xpToAdd: correct }),
        }).catch(err => console.error('Failed to save revision XP:', err));
      }
    }
    setCompletedRevisionIds(prev => {
      const next = new Set(prev);
      next.add(quizId);
      localStorage.setItem('completedRevisionQuizIds', JSON.stringify([...next]));
      return next;
    });
    setActiveRevisionQuiz(null);
  };

  const startLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const handleLessonComplete = (lessonId: string, correct: number, total: number) => {
    // Guard against double firing (React StrictMode or rapid clicks)
    if (!activeLessonId) return;

    // 1 Correct answer = 1 Star (XP)
    const passed = total === 0 || correct === total; // Requires 100% to unlock next

    // Check completion BEFORE updating state
    const currentLesson = lessons.find(l => l.id === lessonId);
    const wasAlreadyCompleted = currentLesson?.completed;

    // Compute new maxUnlockedLessonIndex before setLessons
    const idx = lessons.findIndex(l => l.id === lessonId);
    const newMaxUnlocked = (passed && idx !== -1 && idx + 1 < lessons.length) ? idx + 1 : undefined;
    if (newMaxUnlocked !== undefined) {
      const currentMax = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');
      if (newMaxUnlocked > currentMax) {
        localStorage.setItem('maxUnlockedLessonIndex', newMaxUnlocked.toString());
      }
    }

    setLessons(prev => {
      const updated = [...prev];
      const lessonIdx = updated.findIndex(l => l.id === lessonId);
      if (lessonIdx !== -1) {
        // Mark completed only if perfect
        if (correct === total && total > 0) {
          updated[lessonIdx] = { ...updated[lessonIdx], completed: true };
        }

        // Unlock next lesson ONLY if 100% correct
        if (passed && lessonIdx + 1 < updated.length) {
          updated[lessonIdx + 1] = { ...updated[lessonIdx + 1], locked: false };
        }
      }
      return updated;
    });

    // ALWAYS ensure the local storage unlocks the next lesson if they get 100/100!
    if (passed && total > 0) {
      const currentIdx = lessons.findIndex(l => l.id === lessonId);
      const savedUnlock = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');
      if (currentIdx !== -1 && currentIdx + 1 > savedUnlock) {
        localStorage.setItem('maxUnlockedLessonIndex', String(currentIdx + 1));

        // Persist to backend if logged in
        const token = localStorage.getItem('token');
        if (token) {
          fetch('/api/auth/lesson-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ maxUnlockedLessonIndex: currentIdx + 1 }),
          }).catch(err => console.error('Failed to save progress:', err));
        }
      }
    }

    // Add XP side-effect safely outside the updater ONLY if not previously completed
    if (currentLesson && !wasAlreadyCompleted && passed && total > 0) {
      const newXp = xp + correct;
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());

      // Persist to backend if logged in
      const token = localStorage.getItem('token');
      if (token) {
        const currentMax = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');
        fetch('/api/auth/xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ xpToAdd: correct, maxUnlockedLessonIndex: newMaxUnlocked !== undefined ? Math.max(newMaxUnlocked, currentMax) : undefined }),
        }).catch(err => console.error('Failed to save XP:', err));
      }
    }

    setActiveLessonId(null);
  };


  const handleOnboardingAnswer = (idx: number) => {
    if (idx === onboardingQuestions[onboardingQIndex]?.correct) {
      setOnboardingScore(s => s + 1);
    }
    if (onboardingQIndex + 1 < onboardingQuestions.length) {
      setOnboardingQIndex(i => i + 1);
    } else {
      setOnboardingFinished(true);
    }
  };

  // Finish onboarding completely (go to register)
  const completeOnboarding = () => {
    const newLevel = onboardingScore + 1;
    setLevel(newLevel);
    setShowOnboarding(false);
    localStorage.setItem('onboardingFinished', 'true');
    localStorage.setItem('initialLevel', newLevel.toString());
    localStorage.setItem('initialXp', '0'); // Fresh level, 0 xp
    navigate('/register');
  };

  const handleBackToOnboarding = () => {
    setOnboardingQIndex(0);
    setOnboardingScore(0);
    setOnboardingFinished(false);
    setShowOnboarding(true); // Force it back open
    navigate('/');
  };

  const mainApp = (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <Header
        streak={streak}
        xp={xp}
        level={level}
        authToken={authToken}
        authUsername={authUsername}
        authRole={authRole}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 pb-32">
        <AnimatePresence mode="wait">

          {/* Learn Tab */}
          {isLearn && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DailyWord onLearnMore={() => navigate('/glossary')} />

              {/* Daily Quiz CTA */}
              {(authRole === 'ADMIN' || (!dailyQuizCompleted && !dailyQuizStarted)) && (
                <div className="relative rounded-3xl p-6 mb-8 overflow-hidden bg-brand-secondary shadow-xl shadow-brand-secondary/30">
                  {/* Decorative blobs */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: title + rewards */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                          <Gamepad2 size={18} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Daily Quiz</h3>
                      </div>
                      <p className="text-white/70 font-medium text-sm mb-3">Test your knowledge up to Level {level}!</p>

                      {/* Reward chips */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black text-white/60 uppercase tracking-wider">All correct →</span>
                        <div className="flex items-center gap-1 bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow px-3 py-1 rounded-full text-sm font-black">
                          <Star size={13} fill="currentColor" />
                          <span>+10 Stars</span>
                        </div>
                        <div className="flex items-center gap-1 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent px-3 py-1 rounded-full text-sm font-black">
                          <Flame size={13} fill="currentColor" />
                          <span>+1 Streak</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA button */}
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        localStorage.setItem('dailyQuizStartedDate', new Date().toDateString());
                        setDailyQuizStarted(true);
                        setShowDailyQuiz(true);
                      }}
                      className="shrink-0 bg-white text-brand-secondary px-7 py-3.5 rounded-2xl font-black text-base shadow-[0_4px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-none transition-all"
                    >
                      Start Quiz →
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Path */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <BookOpen className="text-brand-primary" />
                    LEARNING PATH
                  </h3>
                  <LessonPath
                    lessons={lessons}
                    onStart={startLesson}
                    revisionQuizzes={revisionQuizzes}
                    completedRevisionIds={completedRevisionIds}
                    onStartRevision={setActiveRevisionQuiz}
                  />
                </div>

                {/* Sidebar — simplified scoring */}
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-brand-yellow/10 border-2 border-brand-yellow/40 rounded-3xl p-8 text-center transition-shadow hover:shadow-xl hover:shadow-brand-yellow/10"
                  >
                    <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                      <Star size={32} className="text-white fill-white" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 leading-tight">1 Correct = 1 Star</p>
                    <p className="text-sm font-bold text-slate-500 mt-2">Get all questions correct to unlock the next level!</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-brand-primary/10 border-2 border-brand-primary/30 rounded-3xl p-6 flex items-center gap-4 transition-shadow hover:shadow-xl hover:shadow-brand-primary/10"
                  >
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shrink-0">
                      <Trophy size={20} className="text-white" fill="white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">Perfect Score</p>
                      <p className="text-xs font-bold text-slate-500">Unlocks next lesson</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Glossary Tab */}
          {isGlossary && (
            <motion.div
              key="dict"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-black mb-2">The Alpha Glossary</h2>
              <p className="text-slate-500 mb-8">Master the vocabulary of the new generation.</p>
              <Glossary lessonIdToPosition={lessonIdToPosition} />
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {isLeaderboard && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Trophy size={48} className="mb-4 opacity-50" />
                <p className="font-bold">Leaderboard coming soon.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation — matches CS203T1-main */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-2 sm:py-4 z-50 shadow-[0_-1px_0_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/home')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${isLearn ? 'text-brand-primary bg-brand-primary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <BookOpen size={24} />
            <span className="text-[10px] font-black uppercase">Learn</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/leaderboard')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${isLeaderboard ? 'text-brand-secondary bg-brand-secondary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Trophy size={24} />
            <span className="text-[10px] font-black uppercase">Ranks</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/glossary')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${isGlossary ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Search size={24} />
            <span className="text-[10px] font-black uppercase">Glossary</span>
          </motion.button>
          {authRole === 'ADMIN' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/admin')}
              className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${location.pathname.startsWith('/admin') ? 'text-purple-500 bg-purple-500/10' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Shield size={24} />
              <span className="text-[10px] font-black uppercase">Admin</span>
            </motion.button>
          )}
        </div>
      </nav>

      {/* Lesson Session (full-screen Duolingo-style) */}
      <AnimatePresence>
        {activeLessonId && (
          <LessonSession
            lessonId={activeLessonId}
            initialCompleted={lessons.find(l => l.id === activeLessonId)?.completed || false}
            onClose={() => setActiveLessonId(null)}
            onComplete={handleLessonComplete}
          />
        )}
      </AnimatePresence>

      {/* Daily Quiz Modal */}
      <DailyQuizModal
        show={showDailyQuiz}
        onClose={() => setShowDailyQuiz(false)}
        onComplete={handleDailyQuizComplete}
        questions={dailyQuizQuestions}
      />

      {/* Revision Quiz Modal */}
      <AnimatePresence>
        {activeRevisionQuiz && (
          <RevisionQuizModal
            key={activeRevisionQuiz.id}
            quiz={activeRevisionQuiz}
            onClose={() => setActiveRevisionQuiz(null)}
            onComplete={(correct, total) =>
              handleRevisionQuizComplete(activeRevisionQuiz.id, correct, total)
            }
          />
        )}
      </AnimatePresence>
      {/* Scroll-to-top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrolltop"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-5 z-50 w-12 h-12 bg-brand-primary text-white rounded-2xl shadow-lg shadow-brand-primary/40 flex items-center justify-center"
            aria-label="Back to top"
          >
            <ChevronUp size={22} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={
        <LoginPage
          onLoginSuccess={handleAuthSuccess}
          onGoToRegister={() => navigate('/')}
          onBack={handleBackToOnboarding}
        />
      } />
      <Route path="/register" element={
        <RegisterPage
          onRegisterSuccess={handleAuthSuccess}
          onGoToLogin={() => navigate('/login')}
          onBack={handleBackToOnboarding}
        />
      } />
      <Route path="/" element={
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <OnboardingModal
            show={true}
            qIndex={onboardingQIndex}
            score={onboardingScore}
            finished={onboardingFinished}
            questions={onboardingQuestions}
            onAnswer={handleOnboardingAnswer}
            onComplete={completeOnboarding}
            onLogin={() => navigate('/login')}
          />
        </div>
      } />
      <Route path="/home/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding || location.pathname === '/') ? mainApp : <Navigate to="/" replace />
      } />
      <Route path="/leaderboard/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding || location.pathname === '/') ? mainApp : <Navigate to="/" replace />
      } />
      <Route path="/glossary/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding || location.pathname === '/') ? mainApp : <Navigate to="/" replace />
      } />
      <Route path="/admin/*" element={
        (!authToken || authRole !== 'ADMIN') ? <Navigate to="/home" replace /> :
          <AdminPanel onBack={() => navigate('/home')} />
      } />
      {/* Fallback: redirect unknown URLs to login if not authenticated, else home */}
      <Route path="/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          showOnboarding ? <Navigate to="/" replace /> : <Navigate to="/home" replace />
      } />
    </Routes>
  );
}
