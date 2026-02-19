/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Star,
  Zap,
  LayoutGrid,
  Info,
  Lock,
  Check
} from 'lucide-react';
import { SLANG_DATA, QUIZ_QUESTIONS, LESSON_CONTENT } from './constants';
import { SlangTerm, UserProgress, QuizQuestion } from './types';

// --- Components ---

const Header = ({ progress }: { progress: UserProgress }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
    <div className="max-w-5xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">
          α
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight hidden sm:block">
          Alpha<span className="text-brand-primary">Lingo</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-orange-500 font-bold">
          <Flame size={20} fill="currentColor" />
          <span>{progress.streak}</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-yellow font-bold">
          <Star size={20} fill="currentColor" />
          <span>{progress.xp}</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-accent font-bold">
          <Zap size={20} fill="currentColor" />
          <span>LVL {progress.level}</span>
        </div>
      </div>
    </div>
  </header>
);

const DailyWord = () => {
  const todayWord = SLANG_DATA[0]; // Simplified for demo
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-brand-yellow text-slate-900 text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
            Daily Slang
          </span>
          <span className="text-slate-400 text-xs font-medium">Feb 18, 2026</span>
        </div>
        <h2 className="text-5xl font-black mb-2">{todayWord.term}</h2>
        <p className="text-xl text-slate-300 mb-6 max-w-xl">
          {todayWord.definition}
        </p>
        <div className="flex gap-3">
          <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">
            Learn More
          </button>
          <button className="border border-white/20 px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
            Share
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-3xl -mr-20 -mt-20 rounded-full" />
    </motion.div>
  );
};

const LessonPath = ({ progress, onSelectLesson }: { progress: UserProgress, onSelectLesson: (id: string) => void }) => {
  const levels = [
    { id: '1', name: 'Rizz Basics', icon: <BookOpen />, color: 'bg-brand-primary', x: 0 },
    { id: '2', name: 'Fanum Tax', icon: <LayoutGrid />, color: 'bg-brand-secondary', x: 60 },
    { id: '3', name: 'Ohio Lore', icon: <Zap />, color: 'bg-brand-yellow', x: -60 },
    { id: '4', name: 'Skibidi 101', icon: <Star />, color: 'bg-brand-accent', x: 0 },
    { id: '5', name: 'Mewing Pro', icon: <Flame />, color: 'bg-orange-500', x: 60 },
    { id: '6', name: 'Sigma Mindset', icon: <Trophy />, color: 'bg-indigo-500', x: -60 },
    { id: '7', name: 'Delulu Land', icon: <Info />, color: 'bg-pink-500', x: 0 },
  ];

  return (
    <div className="relative flex flex-col-reverse items-center py-16 overflow-visible">
      {/* Floating background elements */}
      <div className="absolute bottom-20 left-10 w-12 h-12 bg-pink-200 rounded-full blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-60 right-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse" />
      <div className="absolute top-40 left-20 w-20 h-20 bg-yellow-200 rounded-full blur-xl opacity-30 animate-pulse" />

      {/* Background path decoration - a subtle dashed line connecting levels */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <svg width="200" height="100%" className="opacity-10" style={{ minHeight: '800px' }}>
          <path 
            d="M 100 900 C 20 800, 180 700, 100 600 S 20 400, 100 300 S 180 100, 100 0" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeDasharray="20 20"
            fill="none" 
            className="text-slate-900"
          />
        </svg>
      </div>

      {levels.map((level, i) => {
        const isCompleted = progress.completedLessons.includes(level.id);
        const isUnlocked = i === 0 || progress.completedLessons.includes(levels[i - 1].id);
        const isCurrent = isUnlocked && !isCompleted;

        return (
          <div 
            key={level.id} 
            className="relative flex flex-col items-center mt-16 first:mt-0"
            style={{ transform: `translateX(${level.x}px)` }}
          >
            <motion.button
              whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
              whileTap={isUnlocked ? { scale: 0.9 } : {}}
              onClick={() => isUnlocked && onSelectLesson(level.id)}
              className={`
                ${isUnlocked ? level.color : 'bg-slate-300'} 
                w-20 h-20 rounded-full flex items-center justify-center text-white 
                shadow-[0_8px_0_rgb(0,0,0,0.2)] border-4 border-white relative z-10
                ${!isUnlocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
              `}
            >
              {isUnlocked ? (
                isCompleted ? <Check size={28} /> : React.cloneElement(level.icon as React.ReactElement, { size: 28 })
              ) : (
                <Lock size={28} />
              )}
              
              {/* Glossy effect */}
              {isUnlocked && <div className="absolute top-1 left-2 w-8 h-4 bg-white/30 rounded-full blur-[1px]" />}
              
              {isCurrent && (
                <div className="absolute -top-10 whitespace-nowrap bg-brand-yellow text-slate-900 text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                  NEXT UP
                </div>
              )}
              
              {/* Level Number */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-xs border-2 border-slate-200 shadow-sm">
                {i + 1}
              </div>
            </motion.button>
            
            <span className={`
              mt-4 font-black uppercase tracking-tight text-[10px] px-3 py-1 rounded-full shadow-sm border whitespace-nowrap
              ${isUnlocked ? 'bg-white/90 text-slate-600 border-slate-100' : 'bg-slate-100 text-slate-400 border-slate-200'}
            `}>
              {level.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const QuizMode = ({ onComplete }: { onComplete: () => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === question.correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const next = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-black text-slate-400">QUESTION {currentIdx + 1} OF {QUIZ_QUESTIONS.length}</span>
          <span className="font-black text-brand-primary">{score * 100} PTS</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-3xl font-black mb-12 text-center">{question.question}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {question.options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`
              kahoot-btn p-6 rounded-2xl text-white font-bold text-xl text-left flex items-center justify-between
              ${selected === i ? 'ring-4 ring-slate-900 ring-offset-2' : ''}
              ${selected !== null && i === question.correctAnswer ? 'bg-green-500' : selected === i ? 'bg-red-500' : colors[i]}
              ${selected !== null && i !== question.correctAnswer && selected !== i ? 'opacity-50 grayscale' : ''}
            `}
          >
            <span>{opt}</span>
            {selected !== null && i === question.correctAnswer && <CheckCircle2 />}
            {selected === i && i !== question.correctAnswer && <XCircle />}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl mb-8 border-2 ${
              isCorrect 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <p className="font-black text-lg">
                {isCorrect ? 'AMAZING RIZZ!' : 'L + RATIO...'}
              </p>
            </div>
            
            <p className="text-sm font-medium leading-relaxed">
              {isCorrect ? (
                <span>
                  That's right! <span className="font-bold">{question.options[question.correctAnswer]}</span> is the correct term. {question.explanation}
                </span>
              ) : (
                <span>
                  Not quite. You chose <span className="font-bold line-through opacity-60">{question.options[selected]}</span>, but the correct answer is <span className="font-bold underline">{question.options[question.correctAnswer]}</span>. {question.explanation}
                </span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {selected !== null && (
        <button
          onClick={next}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xl hover:bg-slate-800 transition-colors"
        >
          {currentIdx === QUIZ_QUESTIONS.length - 1 ? 'FINISH' : 'NEXT'}
        </button>
      )}
    </div>
  );
};

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const filtered = SLANG_DATA.filter(s => 
    s.term.toLowerCase().includes(search.toLowerCase()) || 
    s.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search for slang..."
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-brand-primary outline-none transition-colors font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="duo-card"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-black">{item.term}</h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                item.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.difficulty}
              </span>
            </div>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">{item.definition}</p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Example</p>
              <p className="text-sm italic text-slate-700">"{item.example}"</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LessonSession = ({ levelId, onClose, onComplete }: { levelId: string, onClose: () => void, onComplete: (id: string) => void }) => {
  const lesson = LESSON_CONTENT.find(l => l.id === levelId);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [wordBankSelection, setWordBankSelection] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!lesson) return null;

  const step = lesson.steps[stepIdx];
  const progress = ((stepIdx) / lesson.steps.length) * 100;

  const handleCheck = () => {
    if (step.type === 'intro') {
      setIsCorrect(true);
    } else if (step.type === 'select') {
      setIsCorrect(selectedOption === step.correctAnswer);
    } else if (step.type === 'translate') {
      setIsCorrect(wordBankSelection.join(' ') === step.targetSentence);
    }
    setIsChecked(true);
  };

  const handleContinue = () => {
    if (stepIdx < lesson.steps.length - 1) {
      setStepIdx(s => s + 1);
      setSelectedOption(null);
      setWordBankSelection([]);
      setIsChecked(false);
      setIsCorrect(null);
    } else {
      onComplete(levelId);
    }
  };

  const toggleWord = (word: string) => {
    if (isChecked) return;
    if (wordBankSelection.includes(word)) {
      setWordBankSelection(prev => prev.filter(w => w !== word));
    } else {
      setWordBankSelection(prev => [...prev, word]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full px-4 py-6 flex items-center gap-4">
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <XCircle size={32} />
        </button>
        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-brand-yellow font-black">
          <Star size={20} fill="currentColor" />
          <span>{stepIdx + 1}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          <h2 className="text-3xl font-black mb-8">{step.title}</h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={stepIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              {step.type === 'intro' && (
                <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 flex items-start gap-6">
                    <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white shrink-0">
                      <BookOpen size={32} />
                    </div>
                    <div>
                      <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        {step.content}
                      </p>
                    </div>
                  </div>
                  <div className="bg-brand-primary/10 p-6 rounded-2xl border-2 border-brand-primary/20">
                    <p className="text-xs font-black text-brand-primary uppercase mb-2 tracking-widest">Usage Example</p>
                    <p className="text-2xl font-bold text-slate-800 italic">"{step.explanation}"</p>
                  </div>
                </div>
              )}

              {step.type === 'select' && (
                <div className="grid grid-cols-1 gap-4">
                  {step.options?.map((opt, i) => (
                    <button
                      key={opt}
                      disabled={isChecked}
                      onClick={() => setSelectedOption(i)}
                      className={`
                        p-6 rounded-2xl border-2 text-left font-bold text-xl transition-all
                        ${selectedOption === i 
                          ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
                        ${isChecked && i === step.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                        ${isChecked && selectedOption === i && i !== step.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                      `}
                    >
                      <span className="mr-4 text-slate-300">{i + 1}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {step.type === 'translate' && (
                <div className="space-y-12">
                  <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
                    <p className="text-2xl font-bold text-slate-700">{step.content}</p>
                  </div>

                  <div className="min-h-[100px] border-b-2 border-slate-200 flex flex-wrap gap-2 p-2">
                    {wordBankSelection.map((word) => (
                      <button
                        key={word}
                        onClick={() => toggleWord(word)}
                        className="bg-white border-2 border-b-4 border-slate-200 px-4 py-2 rounded-xl font-bold text-lg active:translate-y-1 active:border-b-2 transition-all"
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {step.wordBank?.map((word) => (
                      <button
                        key={word}
                        disabled={wordBankSelection.includes(word) || isChecked}
                        onClick={() => toggleWord(word)}
                        className={`
                          px-4 py-2 rounded-xl font-bold text-lg border-2 border-b-4 transition-all
                          ${wordBankSelection.includes(word) 
                            ? 'bg-slate-100 border-slate-100 text-transparent border-b-0' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 active:translate-y-1 active:border-b-2'}
                        `}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t-2 p-6 transition-colors ${
        !isChecked ? 'bg-white border-slate-100' : 
        isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
      }`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {isChecked && (
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCorrect ? <CheckCircle2 /> : <XCircle />}
              </div>
              <div>
                <p className={`font-black text-xl ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Excellent!' : 'Correct solution:'}
                </p>
                {!isCorrect && <p className="text-red-700 font-bold">{step.correctAnswer || step.targetSentence}</p>}
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{step.explanation}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={isChecked ? handleContinue : handleCheck}
            disabled={!isChecked && step.type === 'select' && selectedOption === null}
            className={`
              ml-auto px-12 py-4 rounded-2xl font-black text-xl transition-all
              ${!isChecked 
                ? (step.type === 'select' && selectedOption === null ? 'bg-slate-200 text-slate-400' : 'bg-brand-primary text-white shadow-[0_6px_0_#46a302]') 
                : (isCorrect ? 'bg-green-500 text-white shadow-[0_6px_0_#3d8b02]' : 'bg-red-500 text-white shadow-[0_6px_0_#c40000]')
              }
              active:translate-y-1 active:shadow-none
            `}
          >
            {isChecked ? 'CONTINUE' : 'CHECK'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'dictionary'>('learn');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    streak: 12,
    xp: 450,
    level: 5,
    completedLessons: [],
    dailyDone: false
  });

  const handleQuizComplete = () => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + 100,
      dailyDone: true
    }));
    setActiveTab('learn');
  };

  const handleLessonComplete = (id: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(id)) return prev;
      return {
        ...prev,
        xp: prev.xp + 50,
        completedLessons: [...prev.completedLessons, id]
      };
    });
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header progress={progress} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DailyWord />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <BookOpen className="text-brand-primary" />
                    LEARNING PATH
                  </h3>
                  <LessonPath 
                    progress={progress} 
                    onSelectLesson={(id) => setSelectedLesson(id)} 
                  />
                </div>
                <div className="space-y-6">
                  <div className="bg-white border-2 border-slate-200 rounded-3xl p-6">
                    <h4 className="font-black mb-4 flex items-center gap-2">
                      <Trophy className="text-brand-yellow" />
                      LEADERBOARD
                    </h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Kai', xp: 1200, me: false },
                        { name: 'You', xp: 450, me: true },
                        { name: 'Fanum', xp: 320, me: false },
                      ].map((user, i) => (
                        <div key={user.name} className={`flex items-center justify-between p-2 rounded-xl ${user.me ? 'bg-brand-primary/10 ring-1 ring-brand-primary' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-400 w-4">{i + 1}</span>
                            <div className="w-8 h-8 bg-slate-200 rounded-full" />
                            <span className={`font-bold ${user.me ? 'text-brand-primary' : ''}`}>{user.name}</span>
                          </div>
                          <span className="font-black text-slate-500">{user.xp} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-brand-secondary text-white rounded-3xl p-6">
                    <h4 className="font-black mb-2">PRO TIP</h4>
                    <p className="text-sm opacity-80 mb-4">"Mewing" isn't just a cat sound. It's about that jawline definition!</p>
                    <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl font-bold text-sm transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <QuizMode onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {activeTab === 'dictionary' && (
            <motion.div
              key="dictionary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-black mb-2">The Alpha Glossary</h2>
              <p className="text-slate-500 mb-8">Master the vocabulary of the new generation.</p>
              <Dictionary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedLesson && (
          <LessonSession 
            levelId={selectedLesson} 
            onClose={() => setSelectedLesson(null)}
            onComplete={handleLessonComplete}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-2 sm:py-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${activeTab === 'learn' ? 'text-brand-primary bg-brand-primary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <BookOpen size={24} />
            <span className="text-[10px] font-black uppercase">Learn</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${activeTab === 'quiz' ? 'text-brand-secondary bg-brand-secondary/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Gamepad2 size={24} />
            <span className="text-[10px] font-black uppercase">Quiz</span>
          </button>
          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${activeTab === 'dictionary' ? 'text-brand-accent bg-brand-accent/10' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Search size={24} />
            <span className="text-[10px] font-black uppercase">Glossary</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
