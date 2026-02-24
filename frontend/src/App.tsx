import React, { useState } from 'react';
import { BookOpen, Trophy, Search, Flame } from 'lucide-react';
import { SLANG_DATA, LESSON_CONTENT } from './constants';
import { UserProgress } from './types';

export default function App() {
  const [progress] = useState<UserProgress>({
    streak: 12, xp: 450, level: 5, completedLessons: [], dailyDone: false
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0">
        <h1 className="text-xl font-black text-brand-primary">AlphaLingo</h1>
        <div className="flex gap-4 font-bold text-sm">
          <span className="text-orange-500">🔥 {progress.streak}</span>
          <span className="text-yellow-500">⭐ {progress.xp}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-900 text-white p-8 rounded-3xl mb-8">
          <span className="text-brand-yellow text-xs font-black uppercase">Daily Word</span>
          <h2 className="text-4xl font-black mt-2">{SLANG_DATA[0].term}</h2>
          <p className="text-slate-300 mt-2">{SLANG_DATA[0].definition}</p>
        </div>

        <section>
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <BookOpen className="text-brand-primary" /> Learning Path
          </h3>
          <div className="flex flex-col items-center gap-8 py-10">
            {LESSON_CONTENT.map((lesson) => (
              <button key={lesson.id} className="w-20 h-20 rounded-full bg-brand-primary text-white shadow-xl flex items-center justify-center font-bold border-4 border-white hover:scale-110 transition-transform">
                {lesson.id}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}