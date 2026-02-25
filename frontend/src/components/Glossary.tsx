import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { TERMS, LESSONS } from '../data';

const LESSON_ORDER: Record<string, number> = LESSONS.reduce((acc, lesson, index) => {
    acc[lesson.id] = index;
    return acc;
}, {} as Record<string, number>);

const LESSON_TITLES: Record<string, string> = LESSONS.reduce((acc, lesson) => {
    acc[lesson.id] = lesson.title.toLowerCase();
    return acc;
}, {} as Record<string, string>);

const DIFFICULTY_ORDER: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
};

const Glossary = () => {
    const [query, setQuery] = useState('');
    const [sortMode, setSortMode] = useState<'lesson' | 'alpha' | 'difficulty'>('lesson');
    const [showFilters, setShowFilters] = useState(false);

    const queryLower = query.toLowerCase();

    const filtered = TERMS.filter(t => {
        const matchesTerm = t.term.toLowerCase().includes(queryLower);
        const matchesDefinition = t.definition.toLowerCase().includes(queryLower);
        const lessonTitle = t.lessonId ? LESSON_TITLES[t.lessonId] : '';
        const matchesLessonTitle = lessonTitle ? lessonTitle.includes(queryLower) : false;

        return matchesTerm || matchesDefinition || matchesLessonTitle;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortMode === 'lesson') {
            const aRank =
                a.lessonId !== undefined && LESSON_ORDER[a.lessonId] !== undefined
                    ? LESSON_ORDER[a.lessonId]
                    : Number.MAX_SAFE_INTEGER;
            const bRank =
                b.lessonId !== undefined && LESSON_ORDER[b.lessonId] !== undefined
                    ? LESSON_ORDER[b.lessonId]
                    : Number.MAX_SAFE_INTEGER;

            if (aRank !== bRank) {
                return aRank - bRank;
            }
            return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        }

        if (sortMode === 'alpha') {
            return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        }

        if (sortMode === 'difficulty') {
            const aRank = DIFFICULTY_ORDER[a.difficulty] ?? Number.MAX_SAFE_INTEGER;
            const bRank = DIFFICULTY_ORDER[b.difficulty] ?? Number.MAX_SAFE_INTEGER;

            if (aRank !== bRank) {
                return aRank - bRank;
            }
            return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        }

        // Fallback: alphabetical
        return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
    });

    return (
        <div className="py-8">
            {/* Search bar + Filters */}
            <div className="relative mb-8 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for slang..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-brand-primary outline-none transition-colors font-medium"
                    />
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowFilters(prev => !prev)}
                        aria-haspopup="dialog"
                        aria-expanded={showFilters}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-black uppercase tracking-wide shadow-sm transition-colors ${
                            showFilters
                                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <SlidersHorizontal size={18} />
                        <span>Filter</span>
                    </button>

                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 z-10"
                        >
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Arrange by</p>
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSortMode('lesson');
                                        setShowFilters(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                                        sortMode === 'lesson'
                                            ? 'bg-brand-primary/10 text-brand-primary'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    Lesson order
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSortMode('alpha');
                                        setShowFilters(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                                        sortMode === 'alpha'
                                            ? 'bg-brand-primary/10 text-brand-primary'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    A–Z (alphabetical)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSortMode('difficulty');
                                        setShowFilters(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                                        sortMode === 'difficulty'
                                            ? 'bg-brand-primary/10 text-brand-primary'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    Difficulty
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Terms grid — uses .duo-card from index.css */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sorted.map(term => (
                    <motion.div
                        layout
                        key={term.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="duo-card hover:shadow-xl hover:shadow-slate-200/50 transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-black">{term.term}</h3>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase
                ${term.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                    term.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'}`}>
                                {term.difficulty}
                            </span>
                        </div>
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">{term.definition}</p>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Example</p>
                            <p className="text-sm italic text-slate-700">"{term.example}"</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Glossary;
