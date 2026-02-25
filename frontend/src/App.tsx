import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Search, Gamepad2, Star } from 'lucide-react';
import { LESSONS, ONBOARDING_QUESTIONS } from './data';
import type { Lesson } from './types';

import Header from './components/Header';
import DailyWord from './components/DailyWord';
import LessonPath from './components/LessonPath';
import LessonSession from './components/LessonSession';
import OnboardingModal from './components/OnboardingModal';
import Glossary from './components/Glossary';

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'leaderboard' | 'dict'>('learn');
  const [xp, setXp] = useState(50);
  const [level, setLevel] = useState(5);
  const [streak, setStreak] = useState(12);

  // Daily Quiz logic: reset on refresh
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(false);

  const handleDailyQuizComplete = () => {
    setXp(prev => prev + 10);
    setStreak(prev => prev + 1);
    setDailyQuizCompleted(true);
  };

  // Onboarding — reset on refresh
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingQIndex, setOnboardingQIndex] = useState(0);
  const [onboardingScore, setOnboardingScore] = useState(0);
  const [onboardingFinished, setOnboardingFinished] = useState(false);

  // Learning Path
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);

  // Lesson Session
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // --- Handlers ---

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

    setLessons(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(l => l.id === lessonId);
      if (idx !== -1) {
        // Mark completed only if perfect
        if (correct === total && total > 0) {
          updated[idx] = { ...updated[idx], completed: true };
        }

        // Unlock next lesson ONLY if 100% correct
        if (passed && idx + 1 < updated.length) {
          updated[idx + 1] = { ...updated[idx + 1], locked: false };
        }
      }
      return updated;
    });

    // Add XP side-effect safely outside the updater ONLY if not previously completed
    if (currentLesson && !wasAlreadyCompleted) {
      setXp(prev => prev + correct);
    }

    setActiveLessonId(null);
  };


  const handleOnboardingAnswer = (idx: number) => {
    if (idx === ONBOARDING_QUESTIONS[onboardingQIndex].correct) {
      setOnboardingScore(s => s + 1);
    }
    if (onboardingQIndex + 1 < ONBOARDING_QUESTIONS.length) {
      setOnboardingQIndex(i => i + 1);
    } else {
      setOnboardingFinished(true);
    }
  };

  const completeOnboarding = () => {
    const newLevel = onboardingScore + 1;
    setLevel(newLevel);
    setShowOnboarding(false);
    window.location.href = '/signup';
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <Header streak={streak} xp={xp} level={level} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 pb-32">
        <AnimatePresence mode="wait">

          {/* Learn Tab */}
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DailyWord />

              {/* Daily Quiz CTA */}
              {!dailyQuizCompleted && (
                <div className="bg-brand-secondary text-white rounded-3xl p-6 mb-8 flex items-center justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Gamepad2 size={24} />
                      <h3 className="text-2xl font-black">Daily Quiz</h3>
                    </div>
                    <p className="text-white/80 font-medium">Test your knowledge up to Level {level}!</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDailyQuizComplete}
                    className="relative z-10 bg-white text-brand-secondary px-6 py-3 rounded-2xl font-black transition-all shadow-sm"
                  >
                    Start (+10 Stars, +1 Streak)
                  </motion.button>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Path */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <BookOpen className="text-brand-primary" />
                    LEARNING PATH
                  </h3>
                  <LessonPath lessons={lessons} onStart={startLesson} />
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
          {activeTab === 'dict' && (
            <motion.div
              key="dict"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-black mb-2">The Alpha Glossary</h2>
              <p className="text-slate-500 mb-8">Master the vocabulary of the new generation.</p>
              <Glossary />
            </motion.div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
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
        <div className="max-w-md mx-auto flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${activeTab === 'learn' ? 'text-brand-primary bg-brand-primary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <BookOpen size={24} />
            <span className="text-[10px] font-black uppercase">Learn</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${activeTab === 'leaderboard' ? 'text-brand-secondary bg-brand-secondary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Trophy size={24} />
            <span className="text-[10px] font-black uppercase">Ranks</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('dict')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${activeTab === 'dict' ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Search size={24} />
            <span className="text-[10px] font-black uppercase">Glossary</span>
          </motion.button>
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

      {/* Onboarding Modal */}
      <OnboardingModal
        show={showOnboarding}
        qIndex={onboardingQIndex}
        score={onboardingScore}
        finished={onboardingFinished}
        onAnswer={handleOnboardingAnswer}
        onComplete={completeOnboarding}
        onSkip={handleSkipOnboarding}
      />
    </div>
  );
}
