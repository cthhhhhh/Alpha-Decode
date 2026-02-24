import React, { useState } from 'react';
import { BookOpen, Trophy, Flame, Star, Search, Check, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- 1. INTERNAL TYPES (No external file needed) ---
interface Term {
  id: string;
  word: string;
  def: string;
  example: string;
}

interface Lesson {
  id: string;
  title: string;
  color: string;
  locked: boolean;
}

// --- 2. INTERNAL DATA (No external file needed) ---
const TERMS: Term[] = [
  { id: '1', word: 'Rizz', def: 'Charisma, charm, or ability to attract.', example: 'He has unspoken rizz.' },
  { id: '2', word: 'No Cap', def: 'No lie; for real.', example: 'That food was amazing, no cap.' },
  { id: '3', word: 'Bet', def: 'Yes, okay, or agreement.', example: 'Want to go? Bet.' },
];

const LESSONS: Lesson[] = [
  { id: '1', title: 'Rizz 101', color: 'bg-green-500', locked: false },
  { id: '2', title: 'Slang History', color: 'bg-blue-500', locked: false },
  { id: '3', title: 'Mewing Advanced', color: 'bg-purple-500', locked: true },
  { id: '4', title: 'Ohio Lore', color: 'bg-orange-500', locked: true },
];

// --- 3. MAIN COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'dict'>('learn');
  const [streak, setStreak] = useState(12);
  const [xp, setXp] = useState(450);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-100">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-green-500 tracking-tighter">
            Alpha<span className="text-slate-900">Lingo</span>
          </h1>
          <div className="flex gap-4 font-bold text-sm">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame size={18} fill="currentColor" /> {streak}
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={18} fill="currentColor" /> {xp}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT Area */}
      <main className="max-w-md mx-auto p-4 pb-24">
        
        {activeTab === 'learn' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Daily Word Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Daily Drop</span>
                <h2 className="text-4xl font-black mt-2 mb-1">{TERMS[0].word}</h2>
                <p className="text-slate-300 text-lg leading-snug">{TERMS[0].def}</p>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-green-500 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Path */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider ml-2">Learning Path</h3>
              <div className="flex flex-col items-center gap-6">
                {LESSONS.map((lesson, i) => (
                  <button 
                    key={lesson.id}
                    disabled={lesson.locked}
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.1)] 
                      border-4 border-white transition-all active:translate-y-1 active:shadow-none
                      ${lesson.locked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : `${lesson.color} text-white hover:scale-105`}
                    `}
                  >
                    {lesson.locked ? <span className="font-black text-xl">{i+1}</span> : <Star fill="currentColor" size={32} />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dict' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search slang..." 
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            
            {TERMS.map((term) => (
              <div key={term.id} className="bg-white border-2 border-slate-100 p-5 rounded-2xl hover:border-slate-200 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black text-slate-800">{term.word}</h3>
                  <button className="text-slate-300 hover:text-blue-500"><BookOpen size={20} /></button>
                </div>
                <p className="text-slate-600 mt-1 font-medium">{term.def}</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase">Example</p>
                  <p className="text-sm text-slate-700 italic">"{term.example}"</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-2 pb-6 z-50">
        <div className="max-w-md mx-auto flex justify-around">
          <button 
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'learn' ? 'text-green-500' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Trophy size={24} />
            <span className="text-[10px] font-black uppercase">Learn</span>
          </button>
          <button 
            onClick={() => setActiveTab('dict')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'dict' ? 'text-blue-500' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <BookOpen size={24} />
            <span className="text-[10px] font-black uppercase">Dictionary</span>
          </button>
        </div>
      </nav>

    </div>
  );
}