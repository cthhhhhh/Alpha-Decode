import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Flag, Bookmark, Lock } from 'lucide-react';
import FlagModal from './FlagModal';

interface ApiTerm {
    id: number;
    term: string;
    definition: string;
    example: string;
    difficulty: string;
    category: string;
    lesson_id: number | null;
}

interface Props {
    lessonIdToPosition: Record<string, number>;
    completedLessonIds: Set<string>;
}

const DIFFICULTY_ORDER: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

const Glossary = ({ lessonIdToPosition, completedLessonIds }: Props) => {
    const [terms, setTerms] = useState<ApiTerm[]>([]);
    const [query, setQuery] = useState('');
    const [sortMode, setSortMode] = useState<'lesson' | 'alpha' | 'difficulty'>('lesson');
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [flagTarget, setFlagTarget] = useState<number | null>(null);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    useEffect(() => {
        fetch('/api/terms/')
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data: ApiTerm[]) => setTerms(data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('/api/bookmarks', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((ids: number[]) => setBookmarkedIds(new Set(ids)))
            .catch(() => {});
    }, []);

    const handleBookmark = (termId: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const isBookmarked = bookmarkedIds.has(termId);
        // Optimistic update
        setBookmarkedIds(prev => {
            const next = new Set(prev);
            if (isBookmarked) next.delete(termId);
            else next.add(termId);
            return next;
        });
        fetch(`/api/bookmarks/${termId}`, {
            method: isBookmarked ? 'DELETE' : 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => {
            // Revert on failure
            setBookmarkedIds(prev => {
                const next = new Set(prev);
                if (isBookmarked) next.add(termId);
                else next.delete(termId);
                return next;
            });
        });
    };

    const position = (lessonId: number | null) =>
        lessonId !== null ? (lessonIdToPosition[String(lessonId)] ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;

    const ALL_CATEGORIES = Array.from(new Set(terms.map(t => t.category).filter(Boolean)));

    const queryLower = query.toLowerCase();

    const filtered = terms.filter(t => {
        const matchesTerm = t.term.toLowerCase().includes(queryLower);
        const matchesDef = t.definition.toLowerCase().includes(queryLower);
        const matchesEx = t.example.toLowerCase().includes(queryLower);
        const matchesCat = t.category ? t.category.toLowerCase().includes(queryLower) : false;
        const matchesCategoryFilter = categoryFilter ? t.category === categoryFilter : true;
        const matchesSaved = showSavedOnly ? bookmarkedIds.has(t.id) : true;
        return (matchesTerm || matchesDef || matchesEx || matchesCat) && matchesCategoryFilter && matchesSaved;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortMode === 'lesson') {
            const diff = position(a.lesson_id) - position(b.lesson_id);
            return diff !== 0 ? diff : a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        }
        if (sortMode === 'alpha') return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        if (sortMode === 'difficulty') {
            const diff = (DIFFICULTY_ORDER[a.difficulty] ?? 99) - (DIFFICULTY_ORDER[b.difficulty] ?? 99);
            return diff !== 0 ? diff : a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        }
        return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
    });

    return (
        <div className="py-8">
            {/* Search bar + Filters */}
            <div className="relative mb-6 flex items-center gap-3">
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

                {/* Saved filter toggle */}
                {localStorage.getItem('token') && (
                    <button
                        type="button"
                        onClick={() => setShowSavedOnly(v => !v)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-black uppercase tracking-wide shadow-sm transition-colors ${showSavedOnly
                            ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        title="Show saved terms only"
                    >
                        <Bookmark size={18} fill={showSavedOnly ? 'currentColor' : 'none'} />
                        <span>Saved</span>
                        {bookmarkedIds.size > 0 && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${showSavedOnly ? 'bg-brand-yellow/30 text-brand-yellow' : 'bg-slate-200 text-slate-500'}`}>
                                {bookmarkedIds.size}
                            </span>
                        )}
                    </button>
                )}

                <div className="relative" ref={filterRef}>
                    <button
                        type="button"
                        onClick={() => setShowFilters(prev => !prev)}
                        aria-haspopup="dialog"
                        aria-expanded={showFilters}
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-black uppercase tracking-wide shadow-sm transition-colors ${showFilters
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
                            className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 z-10"
                        >
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Arrange by</p>
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                                {(['lesson', 'alpha', 'difficulty'] as const).map(mode => (
                                    <button key={mode} type="button" onClick={() => { setSortMode(mode); setShowFilters(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${sortMode === mode ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        {mode === 'lesson' ? 'Lesson order' : mode === 'alpha' ? 'A–Z (alphabetical)' : 'Difficulty'}
                                    </button>
                                ))}
                            </div>

                            <div className="px-4 py-3 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Filter by category</p>
                                <div className="flex flex-wrap gap-1.5">
                                    <button type="button" onClick={() => setCategoryFilter(null)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border transition-colors ${categoryFilter === null ? 'bg-brand-primary border-brand-primary text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        All
                                    </button>
                                    {ALL_CATEGORIES.map(cat => (
                                        <button key={cat} type="button" onClick={() => setCategoryFilter(prev => prev === cat ? null : cat)}
                                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border transition-colors ${categoryFilter === cat ? 'bg-brand-primary border-brand-primary text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <FlagModal
                show={flagTarget !== null}
                contentType="TERM"
                contentId={flagTarget ?? 0}
                onClose={() => setFlagTarget(null)}
            />

            {/* Terms grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sorted.map(term => {
                    const lessonPos = term.lesson_id !== null ? lessonIdToPosition[String(term.lesson_id)] : undefined;
                    const isLocked = term.lesson_id !== null && !completedLessonIds.has(String(term.lesson_id));
                    const isBookmarked = bookmarkedIds.has(term.id);
                    return (
                        <motion.div
                            layout
                            key={term.id}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={!isLocked ? { scale: 0.98 } : {}}
                            className={`duo-card hover:shadow-xl hover:shadow-slate-200/50 transition-all ${isLocked ? 'bg-slate-50/50 border-dashed border-slate-200 opacity-80' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col gap-1">
                                    <h3 className={`text-xl font-black ${isLocked ? 'text-slate-400' : ''}`}>{term.term}</h3>
                                    {lessonPos !== undefined && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit uppercase tracking-wide px-1 ${isLocked ? 'bg-slate-200 text-slate-500' : 'text-brand-primary bg-brand-primary/10'}`}>
                                            Lesson {lessonPos}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {!isLocked ? (
                                        <>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase
                                                ${term.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                term.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                                {term.difficulty}
                                            </span>
                                            {localStorage.getItem('token') && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleBookmark(term.id); }}
                                                    className={`transition-colors ${isBookmarked ? 'text-brand-yellow' : 'text-slate-300 hover:text-brand-yellow'}`}
                                                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark this term'}
                                                >
                                                    <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
                                                </button>
                                            )}
                                            <button
                                                onClick={e => { e.stopPropagation(); setFlagTarget(term.id); }}
                                                className="text-slate-300 hover:text-red-400 transition-colors"
                                                title="Flag this term"
                                            >
                                                <Flag size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Lock size={14} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {isLocked ? (
                                <div className="py-4 flex flex-col items-center justify-center text-center">
                                    <p className="text-xs font-bold text-slate-400">
                                        Complete Lesson {lessonPos} to unlock this slang.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">{term.definition}</p>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Example</p>
                                        <p className="text-sm italic text-slate-700">"{term.example}"</p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Glossary;
