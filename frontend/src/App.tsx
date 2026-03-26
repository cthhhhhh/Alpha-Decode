import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Search, Gamepad2, Star, Flame, Shield, ChevronUp, User } from 'lucide-react';
import type { Lesson, RevisionQuiz, RevisionQuizQuestion } from './types';

import Header from './components/Header';
import DailyWord from './components/DailyWord';
import LessonPath from './components/LessonPath';
import LearnSidebarLeft from './components/LearnSidebarLeft';
import LessonSession from './components/LessonSession';
import OnboardingModal from './components/OnboardingModal';
import DailyQuizModal from './components/DailyQuizModal';
import RevisionQuizModal from './components/RevisionQuizModal';
import Glossary from './components/Glossary';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPanel from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';

interface NewAchievement {
  name: string;
  icon: string;
  description: string;
}

type ToastItem = NewAchievement & { _toastId: string };

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
  const [profilePic, setProfilePic] = useState<string | null>(() => localStorage.getItem('profilePic'));

  // --- Active Tab State (derived from URL) ---
  const isLeaderboard = location.pathname.startsWith('/leaderboard');
  const isGlossary = location.pathname.startsWith('/glossary');
  const isProfile = location.pathname.startsWith('/profile');
  const isAdmin = location.pathname.startsWith('/admin');
  const isLearn = !isLeaderboard && !isGlossary && !isProfile && !isAdmin;

  const [loginDates, setLoginDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('loginDates');
    return saved ? JSON.parse(saved) : [];
  });

  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp') || '0'));
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('level') || '1'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('streak') || '0'));
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(() => {
    const saved = localStorage.getItem('dailyQuizDate');
    return saved === new Date().toISOString().slice(0, 10);
  });
  const [dailyQuizStarted, setDailyQuizStarted] = useState(() => {
    const saved = localStorage.getItem('dailyQuizStartedDate');
    return saved === new Date().toISOString().slice(0, 10);
  });

  useEffect(() => {
    if (authToken) {
      // Ping backend to keep session tracker online
      const pingServer = () => {
        fetch('/api/auth/ping', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` }
        }).catch(() => { });
      };
      pingServer(); // Initial ping
      const pingInterval = setInterval(pingServer, 60_000); // Ping every 60s


      // Hydrate profile data from server
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
        .then(r => r.json())
        .then(data => {
          const today = new Date().toISOString().slice(0, 10);
          setLoginDates(prev => {
            if (!prev.includes(today)) {
              const next = [...prev, today];
              localStorage.setItem('loginDates', JSON.stringify(next));
              return next;
            }
            return prev;
          });

          if (data.username) {
            setAuthUsername(data.username);
            localStorage.setItem('username', data.username);
          }
          if (data.level !== undefined) {
            setLevel(data.level);
            localStorage.setItem('level', data.level.toString());
          }
          if (data.xp !== undefined) {
            setXp(data.xp);
            localStorage.setItem('xp', data.xp.toString());
          }
          if (data.streak !== undefined) {
            setStreak(data.streak);
            localStorage.setItem('streak', data.streak.toString());
          }
          if (data.profilePic !== undefined) {
            setProfilePic(data.profilePic);
            if (data.profilePic) localStorage.setItem('profilePic', data.profilePic);
            else localStorage.removeItem('profilePic');
          }
          if (data.maxUnlockedLessonIndex !== undefined) {
            const serverIdx: number = data.maxUnlockedLessonIndex;
            const localIdx = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');
            if (serverIdx >= localIdx) {
              localStorage.setItem('maxUnlockedLessonIndex', serverIdx.toString());
              setLessons(prev => prev.length > 0
                ? prev.map((l, i) => ({ ...l, locked: i > serverIdx, completed: i < serverIdx }))
                : prev
              );
            }
          }
          // Use server-computed boolean — avoids timezone mismatch (server=SGT, client=UTC).
          // Also keeps streak in sync so the sidebar shows the DB value after refresh.
          {
            const doneToday = data.dailyQuizCompletedToday === true;
            setDailyQuizCompleted(doneToday);
            setDailyQuizStarted(doneToday);
            if (doneToday && data.dailyQuizLastDate) {
              localStorage.setItem('dailyQuizDate', data.dailyQuizLastDate);
              localStorage.setItem('dailyQuizStartedDate', data.dailyQuizLastDate);
            } else {
              localStorage.removeItem('dailyQuizDate');
              localStorage.removeItem('dailyQuizStartedDate');
            }
          }
        }).catch(() => { });

      return () => clearInterval(pingInterval);
    }
  }, [authToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().slice(0, 10);
      setDailyQuizCompleted(localStorage.getItem('dailyQuizDate') === today);
      setDailyQuizStarted(localStorage.getItem('dailyQuizStartedDate') === today);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [revisionQuizzes, setRevisionQuizzes] = useState<RevisionQuiz[]>([]);
  const [completedRevisionIds, setCompletedRevisionIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('completedRevisionQuizIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [activeRevisionQuiz, setActiveRevisionQuiz] = useState<RevisionQuiz | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('onboardingFinished') !== 'true';
  });
  const [onboardingQIndex, setOnboardingQIndex] = useState(0);
  const [onboardingScore, setOnboardingScore] = useState(0);
  const [onboardingFinished, setOnboardingFinished] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const lessonsRef = useRef<Lesson[]>([]);
  useEffect(() => { lessonsRef.current = lessons; }, [lessons]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  type QuizQ = { q: string; options: string[]; correct: number; explanation: string };
  type OnbQ = { q: string; options: string[]; correct: number };
  const [dailyQuizQuestions, setDailyQuizQuestions] = useState<QuizQ[]>([]);
  const [onboardingQuestions, setOnboardingQuestions] = useState<OnbQ[]>([]);
  const [lessonIdToPosition, setLessonIdToPosition] = useState<Record<string, number>>({});

  // Achievement toasts
  const [achievementToasts, setAchievementToasts] = useState<ToastItem[]>([]);

  const showAchievementToasts = (achievements: NewAchievement[]) => {
    if (!achievements || achievements.length === 0) return;
    const withIds: ToastItem[] = achievements.map(a => ({ ...a, _toastId: crypto.randomUUID() }));
    setAchievementToasts(prev => [...prev, ...withIds]);
    withIds.forEach((a, i) => {
      setTimeout(() => {
        setAchievementToasts(prev => prev.filter(t => t._toastId !== a._toastId));
      }, 3000 + i * 500);
    });
  };

  // Fetch lesson list from backend on mount
  useEffect(() => {
    fetch('/api/lessons/')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
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
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: { title: string; options: string[]; correctAnswer: number; explanation: string }[]) =>
        setDailyQuizQuestions(data.map(q => ({ q: q.title, options: q.options, correct: q.correctAnswer, explanation: q.explanation })))
      ).catch(() => { });
  }, []);

  // Fetch revision quizzes
  useEffect(() => {
    fetch('/api/quiz/revision')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: { id: number; afterLessonIndex: number; questions: RevisionQuizQuestion[] }[]) =>
        setRevisionQuizzes(data.map(rq => ({
          id: String(rq.id),
          afterLessonIndex: rq.afterLessonIndex,
          questions: rq.questions,
        })))
      ).catch(() => { });
  }, []);

  // Fetch onboarding questions
  useEffect(() => {
    fetch('/api/quiz/onboarding')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: { title: string; options: string[]; correctAnswer: number }[]) =>
        setOnboardingQuestions(data.map(q => ({ q: q.title, options: q.options, correct: q.correctAnswer })))
      ).catch(() => { });
  }, []);

  const handleAuthSuccess = (token: string, role: string, username: string, level?: number, xp?: number, maxUnlockedLessonIndex?: number, streak?: number, dailyQuizLastDate?: string, dailyQuizCompletedToday?: boolean) => {
    setAuthToken(token);
    setAuthRole(role);
    setAuthUsername(username);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    if (level !== undefined) {
      setLevel(level);
      localStorage.setItem('level', level.toString());
    }
    if (xp !== undefined) {
      setXp(xp);
      localStorage.setItem('xp', xp.toString());
    }
    if (streak !== undefined) {
      setStreak(streak);
      localStorage.setItem('streak', streak.toString());
    }
    if (maxUnlockedLessonIndex !== undefined) {
      localStorage.setItem('maxUnlockedLessonIndex', maxUnlockedLessonIndex.toString());
      const idx = maxUnlockedLessonIndex;
      setLessons(prev => prev.map((l, i) => ({
        ...l,
        locked: i > idx,
        completed: i < idx
      })));
    }
    // Use server-supplied boolean to avoid UTC vs server-timezone mismatch.
    {
      const doneToday = dailyQuizCompletedToday === true;
      setDailyQuizCompleted(doneToday);
      setDailyQuizStarted(doneToday);
      if (doneToday && dailyQuizLastDate) {
        localStorage.setItem('dailyQuizDate', dailyQuizLastDate);
        localStorage.setItem('dailyQuizStartedDate', dailyQuizLastDate);
      } else {
        localStorage.removeItem('dailyQuizDate');
        localStorage.removeItem('dailyQuizStartedDate');
      }
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
    setStreak(0);
    navigate('/login');
  };

  // --- Handlers ---

  const handleDailyQuizComplete = (correct: number, total: number) => {
    const isPerfect = correct === total;
    const newStreak = isPerfect ? streak + 1 : 0;

    // Optimistic UI update
    setStreak(newStreak);
    localStorage.setItem('streak', newStreak.toString());
    if (isPerfect) {
      const newXp = xp + 10;
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          xpToAdd: isPerfect ? 10 : 0,
          streakToSet: newStreak,
          dailyQuizCountIncrement: true
        }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.newAchievements) showAchievementToasts(data.newAchievements);
          // Sync exact state from DB reality
          if (data.streak !== undefined) {
            setStreak(data.streak);
            localStorage.setItem('streak', data.streak.toString());
          }
          if (data.level !== undefined) {
            setLevel(data.level);
            localStorage.setItem('level', data.level.toString());
          }
          if (data.xp !== undefined) {
            setXp(data.xp);
            localStorage.setItem('xp', data.xp.toString());
          }
          if (data.dailyQuizCompletedToday === true) {
            setDailyQuizCompleted(true);
            if (data.dailyQuizLastDate) {
              localStorage.setItem('dailyQuizDate', data.dailyQuizLastDate);
            }
          }
        })
        .catch(err => console.error('Failed to save quiz XP:', err));
    }

    // Fallback UI close
    setShowDailyQuiz(false);
  };

  const handleRevisionQuizComplete = (quizId: string, correct: number) => {
    const alreadyDone = completedRevisionIds.has(quizId);
    if (!alreadyDone && correct > 0) {
      const rewardXp = 5;
      const newXp = xp + rewardXp;
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
      
      const quiz = revisionQuizzes.find(q => q.id === quizId);
      const nextIdx = quiz ? quiz.afterLessonIndex + 1 : -1;
      const savedUnlock = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');
      const shouldUnlockNext = nextIdx > 0 && nextIdx < lessonsRef.current.length && nextIdx > savedUnlock;

      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/auth/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ 
            xpToAdd: rewardXp,
            ...(shouldUnlockNext ? { maxUnlockedLessonIndex: nextIdx } : {})
          }),
        })
          .then(r => r.json())
          .then(data => { 
            if (data.newAchievements) showAchievementToasts(data.newAchievements);
            if (data.xp !== undefined) { setXp(data.xp); localStorage.setItem('xp', data.xp.toString()); }
            if (data.level !== undefined) { setLevel(data.level); localStorage.setItem('level', data.level.toString()); }
            if (data.maxUnlockedLessonIndex !== undefined) {
              localStorage.setItem('maxUnlockedLessonIndex', data.maxUnlockedLessonIndex.toString());
              // Force local lessons state refresh
              setLessons(prev => prev.map((l, i) => i <= data.maxUnlockedLessonIndex ? { ...l, locked: false } : l));
            }
          })
          .catch(err => console.error('Failed to save revision XP:', err));
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
    if (!activeLessonId) return;

    const passed = total === 0 || correct === total;

    const currentLesson = lessonsRef.current.find(l => l.id === lessonId);
    const wasAlreadyCompleted = currentLesson?.completed;

    const idx = lessonsRef.current.findIndex(l => l.id === lessonId);
    const savedUnlock = parseInt(localStorage.getItem('maxUnlockedLessonIndex') || '0');
    const nextIdx = idx !== -1 ? idx + 1 : -1;
    
    // REQUIREMENT: Check if there's a RevisionQuiz at this current index (idx)
    // If so, the NEXT lesson (nextIdx) is GATED until the quiz is finished.
    // BUG FIX: Don't gate if the quiz is already completed.
    const hasIncompleteGatingQuiz = revisionQuizzes.some(q => q.afterLessonIndex === idx && !completedRevisionIds.has(q.id.toString()));
    const shouldUnlockNext = passed && nextIdx > 0 && nextIdx < lessonsRef.current.length && nextIdx > savedUnlock && !hasIncompleteGatingQuiz;

    setLessons(prev => {
      const updated = [...prev];
      const lessonIdx = updated.findIndex(l => l.id === lessonId);
      if (lessonIdx !== -1) {
        if (correct === total && total > 0) {
          updated[lessonIdx] = { ...updated[lessonIdx], completed: true };
        }
        if (shouldUnlockNext && lessonIdx + 1 < updated.length) {
          updated[lessonIdx + 1] = { ...updated[lessonIdx + 1], locked: false };
        }
      }
      return updated;
    });

    if (shouldUnlockNext) {
      localStorage.setItem('maxUnlockedLessonIndex', nextIdx.toString());
    }

    const token = localStorage.getItem('token');

    const shouldAwardXp = currentLesson && !wasAlreadyCompleted && passed;

    if (shouldAwardXp) {
      const rewardXp = 5;
      const newXp = xp + rewardXp;
      setXp(newXp);
      localStorage.setItem('xp', newXp.toString());
      
      if (token) {
        fetch('/api/auth/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            xpToAdd: rewardXp,
            ...(shouldUnlockNext ? { maxUnlockedLessonIndex: nextIdx } : {}),
          }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.newAchievements) showAchievementToasts(data.newAchievements);
            if (data.xp !== undefined) { setXp(data.xp); localStorage.setItem('xp', data.xp.toString()); }
            if (data.level !== undefined) { setLevel(data.level); localStorage.setItem('level', data.level.toString()); }
            if (data.maxUnlockedLessonIndex !== undefined) {
              localStorage.setItem('maxUnlockedLessonIndex', data.maxUnlockedLessonIndex.toString());
            }
          })
          .catch(err => console.error('Failed to save XP:', err));
      } else {
        fetch('/api/auth/lesson-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ maxUnlockedLessonIndex: nextIdx }),
        })
          .then(r => r.json())
          .then(data => { if (data.newAchievements) showAchievementToasts(data.newAchievements); })
          .catch(err => console.error('Failed to save progress:', err));
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
    const startingXp = onboardingScore * 50; // 50 XP per level past Level 1

    setLevel(newLevel);
    setXp(startingXp); // Also set the state just in case
    setShowOnboarding(false);
    localStorage.setItem('onboardingFinished', 'true');
    localStorage.setItem('initialLevel', newLevel.toString());
    localStorage.setItem('initialXp', startingXp.toString());
    navigate('/register');
  };


  const mainApp = (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        authToken={authToken}
        authUsername={authUsername}
        profilePic={profilePic}
        onLogout={handleLogout}
        onNavigateHome={() => navigate('/home')}
        onNavigateProfile={() => navigate('/profile')}
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
                        localStorage.setItem('dailyQuizStartedDate', new Date().toISOString().slice(0, 10));
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

              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6 items-start">
                {/* Left Sidebar — scoring info */}
                <div className="hidden lg:block space-y-4 sticky top-24 self-start">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-brand-yellow/10 border-2 border-brand-yellow/40 rounded-3xl p-6 text-center transition-shadow hover:shadow-xl hover:shadow-brand-yellow/10"
                  >
                    <div className="w-14 h-14 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg rotate-3">
                      <Star size={28} className="text-white fill-white" />
                    </div>
                    <p className="text-lg font-black text-slate-900 leading-tight">1 Lesson = 5 Stars</p>
                    <p className="text-xs font-bold text-slate-500 mt-2">Get all questions correct to unlock the next level!</p>
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

                {/* Learning Path */}
                <div>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <BookOpen className="text-brand-primary" />
                    LEARNING PATH
                  </h3>
                  <LessonPath
                    lessons={lessons}
                    onStart={startLesson}
                    revisionQuizzes={revisionQuizzes}
                    completedRevisionIds={authRole === 'ADMIN' ? new Set(revisionQuizzes.map(rq => rq.id)) : completedRevisionIds}
                    onStartRevision={setActiveRevisionQuiz}
                  />
                </div>

                {/* Right Sidebar - Player Stats */}
                <div className="hidden lg:block sticky top-24 self-start">
                  <LearnSidebarLeft
                    level={level}
                    xp={xp}
                    lessonsCompleted={lessons.filter(l => l.completed).length}
                    streak={streak}
                    loginDates={loginDates}
                    onViewGlossary={() => navigate('/glossary')}
                  />
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
              <Glossary
                lessonIdToPosition={lessonIdToPosition}
                completedLessonIds={new Set(lessons.filter(l => l.completed).map(l => l.id))}
              />
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
              <Leaderboard authUsername={authUsername} />
            </motion.div>
          )}

          {/* Profile Tab */}
          {isProfile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-black mb-2">My Profile</h2>
              <p className="text-slate-500 mb-8">Your progress and achievements.</p>
              <ProfilePage
                authUsername={authUsername}
                authToken={authToken}
                onUsernameUpdate={(newUsername, newToken) => {
                  setAuthUsername(newUsername);
                  setAuthToken(newToken);
                  localStorage.setItem('username', newUsername);
                  localStorage.setItem('token', newToken);
                }}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

          {/* Admin Tab */}
          {isAdmin && authRole === 'ADMIN' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminPanel onBack={() => navigate('/home')} />
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all ${isProfile ? 'text-brand-primary bg-brand-primary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <User size={24} />
            <span className="text-[10px] font-black uppercase">Profile</span>
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
        onClose={() => {
          // If the user closes the quiz before finishing, treat it as a failed attempt:
          // reset streak to 0 and record the attempt in the DB so the quiz won't
          // reappear today and the streak correctly goes back to 0.
          if (!dailyQuizCompleted) {
            setStreak(0);
            localStorage.setItem('streak', '0');
            localStorage.setItem('dailyQuizDate', new Date().toISOString().slice(0, 10));
            setDailyQuizCompleted(true);
            const token = localStorage.getItem('token');
            if (token) {
              fetch('/api/auth/xp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ xpToAdd: 0, streakToSet: 0, dailyQuizCountIncrement: true }),
              }).catch(() => { });
            }
          }
          setShowDailyQuiz(false);
        }}
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
            onComplete={(correct) =>
              handleRevisionQuizComplete(activeRevisionQuiz.id, correct)
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

      {/* Achievement Toasts */}
      <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {achievementToasts.slice(0, 3).map((a) => (
            <motion.div
              key={a._toastId}
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="bg-white border-2 border-brand-yellow/40 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 min-w-[220px]"
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-[10px] font-black text-brand-yellow uppercase tracking-wide">Achievement Unlocked!</p>
                <p className="text-sm font-black text-slate-900">{a.name}</p>
                <p className="text-[11px] text-slate-500">{a.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={
        <LoginPage
          onLoginSuccess={handleAuthSuccess}
          onGoToRegister={() => navigate('/onboarding')}
          onBack={() => navigate('/')}
        />
      } />
      <Route path="/register" element={
        <RegisterPage
          onRegisterSuccess={handleAuthSuccess}
          onGoToLogin={() => navigate('/login')}
          onBack={() => navigate('/')}
        />
      } />
      <Route path="/onboarding" element={
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
            onBack={() => navigate('/')}
          />
        </div>
      } />
      <Route path="/" element={
        authToken ? <Navigate to="/home" replace /> : <HomePage authToken={authToken} />
      } />
      <Route path="/home/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding) ? mainApp : <Navigate to="/onboarding" replace />
      } />
      <Route path="/leaderboard/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding) ? mainApp : <Navigate to="/onboarding" replace />
      } />
      <Route path="/glossary/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding) ? mainApp : <Navigate to="/onboarding" replace />
      } />
      <Route path="/profile/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          (!showOnboarding) ? mainApp : <Navigate to="/onboarding" replace />
      } />
      <Route path="/admin/*" element={
        (!authToken || authRole !== 'ADMIN') ? <Navigate to="/home" replace /> :
          (!showOnboarding) ? mainApp : <Navigate to="/onboarding" replace />
      } />
      {/* Fallback: redirect unknown URLs to login if not authenticated, else home */}
      <Route path="/*" element={
        !authToken ? <Navigate to="/login" replace /> :
          showOnboarding ? <Navigate to="/onboarding" replace /> : <Navigate to="/home" replace />
      } />
    </Routes>
  );
}
