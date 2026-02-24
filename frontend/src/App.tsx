import { useState } from 'react';
import { BookOpen, Trophy, Flame, Star, Search, Zap, Lock, Check, Gamepad2, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- DATA & TYPES ---

interface Term {
  id: string;
  term: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Lesson {
  id: string;
  title: string;
  color: string;
  locked: boolean;
  x: number; // For the curved path layout
}

const TERMS: Term[] = [
  {
    id: '1',
    term: 'Rizz',
    definition: 'Short for charisma. Ability to attract a romantic partner.',
    example: "He has so much rizz, he didn't even have to say anything.",
    difficulty: 'easy',
    category: 'noun'
  },
  {
    id: '2',
    term: 'Skibidi',
    definition: 'Often used as a nonsense word or to describe something bad/evil, originating from the Skibidi Toilet series.',
    example: "That's so skibidi of you.",
    difficulty: 'medium',
    category: 'adjective'
  },
  {
    id: '3',
    term: 'Gyatt',
    definition: 'An exclamation used when seeing someone with a large posterior. Derived from "God damn".',
    example: 'Gyatt! Look at that!',
    difficulty: 'easy',
    category: 'reaction'
  },
  {
    id: '4',
    term: 'Fanum Tax',
    definition: 'Stealing a portion of someone else\'s food, popularized by streamer Fanum.',
    example: 'You gotta pay the Fanum Tax on those fries.',
    difficulty: 'medium',
    category: 'noun'
  },
  {
    id: '5',
    term: 'Sigma',
    definition: 'A "lone wolf" or someone who is successful and independent. Often used ironically.',
    example: 'He\'s such a sigma male.',
    difficulty: 'easy',
    category: 'noun'
  },
  {
    id: '6',
    term: 'Ohio',
    definition: 'Used to describe something weird, cringey, or abnormal. Based on memes about the state.',
    example: 'Only in Ohio would that happen.',
    difficulty: 'medium',
    category: 'adjective'
  },
  {
    id: '7',
    term: 'Mewing',
    definition: 'A tongue exercise meant to define the jawline. Often associated with "looksmaxxing".',
    example: 'I can\'t talk right now, I\'m mewing.',
    difficulty: 'hard',
    category: 'verb'
  },
  {
    id: '8',
    term: 'Delulu',
    definition: 'Short for delusional. Often used in the context of fan culture or relationships.',
    example: 'She\'s so delulu if she thinks they\'re dating.',
    difficulty: 'easy',
    category: 'adjective'
  }
];

const LESSONS: Lesson[] = [
  { id: '1', title: 'Rizz Refinery', color: 'bg-green-500', locked: false, x: 0 },
  { id: '2', title: 'Fanum Fields', color: 'bg-indigo-500', locked: false, x: 40 },
  { id: '3', title: 'Ohio Outpost', color: 'bg-yellow-500', locked: true, x: -40 },
  { id: '4', title: 'Skibidi Surfers', color: 'bg-red-500', locked: true, x: 0 },
  { id: '5', title: 'Mewing Meadows', color: 'bg-orange-500', locked: true, x: 40 },
  { id: '6', title: 'Sigma Springs', color: 'bg-purple-500', locked: true, x: -40 },
  { id: '7', title: 'Glazing Gulch', color: 'bg-pink-500', locked: true, x: 0 },
];

const QUIZ_QUESTIONS: Record<string, { q: string; options: string[]; correct: number }[]> = {
  '1': [
    { q: "What is 'Rizz' short for?", options: ["Risk", "Charisma", "Rhythm", "Real"], correct: 1 },
    { q: "If you have 'W Rizz', you are...", options: ["Awkward", "Charming", "Sleepy", "Hungry"], correct: 1 },
  ],
  '2': [
    { q: "What is 'Fanum Tax'?", options: ["A government fee", "Stealing food", "Paying for fans", "A dance move"], correct: 1 },
    { q: "Where did Fanum Tax originate?", options: ["TikTok", "Twitch", "YouTube", "Instagram"], correct: 1 },
  ],
  '3': [
    { q: "Ohio is often associated with...", options: ["Normalcy", "Weird events", "Good weather", "Technology"], correct: 1 },
  ],
  '4': [
    { q: "Skibidi is mostly used as...", options: ["A formal greeting", "A nonsense filler", "A cooking term", "A math concept"], correct: 1 },
  ],
  '5': [
    { q: "Mewing is done to improve...", options: ["Jawline", "Abs", "Hair", "Eyesight"], correct: 0 },
  ],
  '6': [
    { q: "A 'Sigma' is considered...", options: ["A follower", "A lone wolf", "A loud person", "A lazy person"], correct: 1 },
  ],
  '7': [
    { q: "Glazing means...", options: ["Eating donuts", "Over-complimenting", "Sleeping", "Running fast"], correct: 1 },
  ],
};

// --- MAIN COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'leaderboard' | 'dict'>('learn');
  const [streak] = useState(12);
  const [xp] = useState(450);
  const [level] = useState(5);
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(false);
  
  // Learning Path State
  const [lessons, setLessons] = useState(LESSONS);
  const [activeQuiz, setActiveQuiz] = useState<{ lessonId: string; qIndex: number; show: boolean } | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = (lessonId: string) => {
    setActiveQuiz({ lessonId, qIndex: 0, show: true });
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || !activeQuiz) return;
    setSelectedOption(optionIndex);
    
    const currentQuestions = QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'];
    const correct = currentQuestions[activeQuiz.qIndex].correct === optionIndex;
    setIsCorrect(correct);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    const currentQuestions = QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'];
    
    if (activeQuiz.qIndex + 1 < currentQuestions.length) {
      setActiveQuiz({ ...activeQuiz, qIndex: activeQuiz.qIndex + 1 });
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setQuizCompleted(true);
      const currentLessonIndex = lessons.findIndex(l => l.id === activeQuiz.lessonId);
      if (currentLessonIndex !== -1 && currentLessonIndex + 1 < lessons.length) {
        setLessons(prev => prev.map((l, i) => i === currentLessonIndex + 1 ? { ...l, locked: false } : l));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 text-white p-1 rounded-lg">
              <span className="font-black text-xl px-1">a</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Alpha<span className="text-green-500">Lingo</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 font-bold text-sm">
            <div className="flex items-center gap-1.5 text-orange-500">
              <Flame size={20} fill="currentColor" /> <span>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Star size={20} fill="currentColor" /> <span>{xp}</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <Zap size={20} fill="currentColor" /> <span>LVL {level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 pb-24">
        
        {activeTab === 'learn' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Daily Word Banner */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                    Daily Slang
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Feb 24, 2026</span>
                </div>
                <h2 className="text-5xl font-black mb-3">{TERMS[0].term}</h2>
                <p className="text-slate-300 text-lg mb-6">{TERMS[0].definition}</p>
                <div className="flex gap-3">
                  <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                    Learn More
                  </button>
                  <button className="border border-slate-600 text-slate-300 px-6 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
                    Share
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 blur-[100px] rounded-full opacity-20 -mr-20 -mt-20" />
            </div>

            {/* Daily Quiz Box */}
            {!dailyQuizCompleted && (
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Gamepad2 size={24} />
                    <h3 className="text-2xl font-black">Daily Quiz</h3>
                  </div>
                  <p className="text-indigo-100 font-medium">Test your knowledge up to Level {level}!</p>
                </div>
                <button 
                  onClick={() => setDailyQuizCompleted(true)}
                  className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-xl font-black hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Start (+50 XP)
                </button>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Learning Path */}
              <div className="lg:col-span-2">
                <h3 className="font-black text-slate-400 text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                  <BookOpen size={18} /> Learning Path
                </h3>
                
                <div className="relative flex flex-col items-center py-8">
                  {/* Dashed Path Line */}
                  <div className="absolute inset-0 pointer-events-none flex justify-center">
                    <svg width="200" height="100%" className="opacity-10 text-slate-400" style={{ minHeight: '600px' }}>
                      <path 
                        d="M 100 0 Q 140 100, 100 200 T 100 400 T 100 600" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        strokeDasharray="16 16"
                        fill="none" 
                      />
                    </svg>
                  </div>

                  {lessons.map((lesson, i) => (
                    <div 
                      key={lesson.id} 
                      className="relative z-10 mb-12 last:mb-0 flex flex-col items-center group"
                      style={{ transform: `translateX(${lesson.x}px)` }}
                    >
                      <button 
                        onClick={() => !lesson.locked && startQuiz(lesson.id)}
                        disabled={lesson.locked}
                        className={`
                          w-20 h-20 rounded-full flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.2)] 
                          border-4 border-white transition-all active:translate-y-1 active:shadow-none relative
                          ${lesson.locked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : `${lesson.color} text-white hover:scale-110 hover:rotate-3`}
                        `}
                      >
                        {lesson.locked ? <Lock size={28} /> : (i === 0 ? <Star fill="currentColor" size={32} /> : <BookOpen size={28} />)}
                        
                        {!lesson.locked && (
                          <div className="absolute -top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                        )}
                      </button>
                      
                      <span className="mt-3 font-bold text-slate-400 text-xs bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm uppercase tracking-wide">
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Sidebar Widgets */}
              <div className="space-y-6">
                {/* Sidebar is now empty, ready for future widgets */}
              </div>
            </div>
          </motion.div>
        )}

        {/* Glossary Tab */}
        {activeTab === 'dict' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-slate-100 p-4 rounded-2xl">
              <div className="relative text-slate-500">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
                <input type="text" placeholder="Search slang..." className="w-full bg-transparent pl-10 pr-4 py-2 outline-none font-bold text-slate-800" />
              </div>
            </div>
            <div className="grid gap-4">
              {TERMS.map(term => (
                <div key={term.id} className="bg-white border-2 border-slate-100 p-5 rounded-2xl hover:border-green-200 transition-colors relative">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-black text-slate-800">{term.term}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      term.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                      term.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {term.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">{term.category}</p>
                  <p className="text-slate-600 font-medium mb-3">{term.definition}</p>
                  <div className="bg-slate-50 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium italic inline-block">
                    "{term.example}"
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Leaderboard Tab Placeholder */}
        {activeTab === 'leaderboard' && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <Trophy size={48} className="mb-4 opacity-50" />
            <p className="font-bold">Leaderboard coming soon.</p>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-white border-t-2 border-slate-100 py-3 z-50">
        <div className="max-w-md mx-auto flex justify-between px-8">
          {[
            { id: 'learn', icon: BookOpen, label: 'Learn' },
            { id: 'leaderboard', icon: Trophy, label: 'Leaderboards' },
            { id: 'dict', icon: Search, label: 'Glossary' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === item.id 
                  ? 'text-green-500 -translate-y-1' 
                  : 'text-slate-300 hover:text-slate-400'
              }`}
            >
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* QUIZ MODAL */}
      <AnimatePresence>
        {activeQuiz && activeQuiz.show && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Quiz Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setActiveQuiz(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
                <div className="h-3 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500" 
                    style={{ width: quizCompleted ? '100%' : `${((activeQuiz.qIndex) / (QUIZ_QUESTIONS[activeQuiz.lessonId]?.length || 1)) * 100}%` }} 
                  />
                </div>
                <div className="w-6" /> {/* Spacer */}
              </div>

              {/* Quiz Content */}
              <div className="p-8">
                {quizCompleted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy size={40} fill="currentColor" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-2">Lesson Complete!</h3>
                    <p className="text-slate-500 font-medium mb-8">You've mastered this slang. +50 XP</p>
                    <button 
                      onClick={() => setActiveQuiz(null)}
                      className="w-full bg-green-500 text-white py-4 rounded-xl font-black text-lg hover:bg-green-600 transition-colors shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black text-slate-800 mb-8 leading-tight">
                      {(QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].q}
                    </h3>
                    <div className="space-y-3">
                      {(QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={selectedOption !== null}
                          className={`w-full p-4 rounded-xl font-bold text-left border-2 transition-all flex items-center justify-between ${
                            selectedOption === idx 
                              ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          {option}
                          {selectedOption === idx && (isCorrect ? <Check size={20} /> : <X size={20} />)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quiz Footer */}
              {!quizCompleted && selectedOption !== null && (
                <div className={`p-6 border-t ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? 'Nicely done!' : 'Not quite right.'}
                    </div>
                    <button 
                      onClick={handleNextQuestion}
                      className={`px-6 py-3 rounded-xl font-black text-white shadow-sm flex items-center gap-2 ${
                        isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {activeQuiz.qIndex + 1 >= (QUIZ_QUESTIONS[activeQuiz.lessonId]?.length || 0) ? 'Finish' : 'Next'} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}