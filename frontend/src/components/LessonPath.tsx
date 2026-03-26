import { useState } from 'react';
import { motion } from 'motion/react';
import {
    BookOpen,
    LayoutGrid,
    Zap,
    Star,
    Flame,
    Trophy,
    Info,
    Shield,
    Flag,
    type LucideIcon,
} from 'lucide-react';
import type { Lesson, RevisionQuiz } from '../types';
import FlagModal from './FlagModal';

interface Props {
    lessons: Lesson[];
    onStart: (lessonId: string) => void;
    revisionQuizzes: RevisionQuiz[];
    completedRevisionIds: Set<string>;
    onStartRevision: (quiz: RevisionQuiz) => void;
}

interface LevelMeta {
    color: string;
    Icon: LucideIcon;
}

const LEVEL_META: LevelMeta[] = [
    { color: 'bg-brand-primary', Icon: BookOpen },
    { color: 'bg-brand-secondary', Icon: LayoutGrid },
    { color: 'bg-yellow-500', Icon: Zap },
    { color: 'bg-brand-accent', Icon: Star },
    { color: 'bg-orange-500', Icon: Flame },
    { color: 'bg-indigo-500', Icon: Trophy },
    { color: 'bg-pink-500', Icon: Info },
];

type PathNode =
    | { kind: 'lesson'; lesson: Lesson; visibleIndex: number }
    | { kind: 'checkpoint'; quiz: RevisionQuiz; isCompleted: boolean };

const LessonPath = ({ lessons, onStart, revisionQuizzes, completedRevisionIds, onStartRevision }: Props) => {
    const [flagTarget, setFlagTarget] = useState<{ id: number; type: 'LESSON' | 'QUIZ'; context: string } | null>(null);

    const buildNodes = (): PathNode[] => {
        const nodes: PathNode[] = [];
        let visibleIdx = 0;
        lessons.forEach((lesson, originalIdx) => {
            if (lesson.locked) return;
            nodes.push({ kind: 'lesson', lesson, visibleIndex: visibleIdx++ });
            const checkpoint = revisionQuizzes.find(rq => rq.afterLessonIndex === originalIdx);
            if (checkpoint && lesson.completed) {
                nodes.push({
                    kind: 'checkpoint',
                    quiz: checkpoint,
                    isCompleted: completedRevisionIds.has(checkpoint.id),
                });
            }
        });
        return nodes;
    };

    const nodes = buildNodes();

    const NODE_STEP = 160;
    const svgHeight = Math.max(600, nodes.length * NODE_STEP + 200);

    // Calculate dynamic SVG path
    const generatePath = () => {
        if (nodes.length === 0) return "";
        const points = nodes.map((node, i) => ({
            x: 200 + (node.kind === 'lesson' ? (node.lesson.x || 0) : 0),
            y: 80 + i * NODE_STEP,
        }));

        let d = `M ${points[0].x} 0 L ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const dy = (p1.y - p0.y) * 0.5;
            const cp0x = p0.x;
            const cp0y = p0.y + dy;
            const cp1x = p1.x;
            const cp1y = p1.y - dy;
            d += ` C ${cp0x} ${cp0y}, ${cp1x} ${cp1y}, ${p1.x} ${p1.y}`;
        }

        const last = points[points.length - 1];
        d += ` L ${last.x} ${svgHeight}`;

        return d;
    };

    return (
        <div className="relative flex flex-col items-center pt-8 overflow-visible">
            {/* Floating background blobs */}
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-pink-200 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="absolute bottom-60 right-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="absolute top-40 left-20 w-20 h-20 bg-yellow-200 rounded-full blur-xl opacity-30 animate-pulse" />

            {/* Background dashed path */}
            <div className="absolute inset-0 pointer-events-none flex justify-center overflow-visible">
                <svg
                    width="400"
                    height={svgHeight}
                    viewBox={`0 0 400 ${svgHeight}`}
                    className="opacity-20 overflow-visible"
                    style={{ minHeight: svgHeight }}
                >
                    <path
                        d={generatePath()}
                        stroke="currentColor"
                        strokeWidth="14"
                        strokeDasharray="12 16"
                        fill="none"
                        className="text-slate-900"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {nodes.map((node, i) => {
                if (node.kind === 'lesson') {
                    const { lesson, visibleIndex } = node;
                    const meta = LEVEL_META[visibleIndex] ?? LEVEL_META[0];
                    const { Icon } = meta;
                    const isCompleted = lesson.completed;
                    const isCurrent = !isCompleted;
                    const unlockedLessons = nodes.filter(n => n.kind === 'lesson').map(n => (n as { kind: 'lesson'; lesson: Lesson; visibleIndex: number }).lesson);
                    const firstIncompleteIndex = unlockedLessons.findIndex(l => !l.completed);

                    return (
                        <div
                            key={lesson.id}
                            className="relative flex flex-col items-center mt-16 first:mt-0"
                            style={{ transform: `translateX(${lesson.x}px)` }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onStart(lesson.id)}
                                className={`
                                    ${isCompleted ? 'bg-brand-primary' : meta.color}
                                    w-20 h-20 rounded-full flex items-center justify-center text-white
                                    shadow-[0_8px_0_rgb(0,0,0,0.2)] border-4 border-white relative z-10
                                    cursor-pointer
                                `}
                            >
                                {isCompleted ? <Trophy size={28} fill="white" /> : <Icon size={28} />}

                                {/* Glossy sheen */}
                                <div className="absolute top-1 left-2 w-8 h-4 bg-white/30 rounded-full blur-[1px]" />

                                {/* NEXT UP badge */}
                                {isCurrent && visibleIndex === firstIncompleteIndex && (
                                    <div className="absolute -top-10 whitespace-nowrap bg-brand-yellow text-slate-900 text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                                        NEXT UP
                                    </div>
                                )}

                                {/* Level number bubble */}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-xs border-2 border-slate-200 shadow-sm">
                                    {visibleIndex + 1}
                                </div>
                            </motion.button>

                            <div className="mt-4 relative flex items-center justify-center">
                                <span className="font-black uppercase tracking-tight text-[10px] px-3 py-1 rounded-full shadow-sm border whitespace-nowrap bg-white/90 text-slate-600 border-slate-100">
                                    {lesson.title}
                                </span>
                                <button
                                    onClick={e => { e.stopPropagation(); setFlagTarget({ id: parseInt(lesson.id), type: 'LESSON', context: `Lesson: ${lesson.title}` }); }}
                                    className="absolute left-[calc(100%+8px)] text-slate-400 hover:bg-red-50 hover:text-red-500 bg-white/90 shadow-sm border border-slate-100 rounded-full p-1.5 transition-colors"
                                    title="Flag this lesson"
                                >
                                    <Flag size={14} />
                                </button>
                            </div>

                        </div>
                    );
                }

                // Checkpoint node
                const { quiz, isCompleted } = node;
                return (
                    <div key={`checkpoint-${quiz.id}-${i}`} className="relative flex flex-col items-center mt-16" style={{ transform: 'translateX(0px)' }}>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onStartRevision(quiz)}
                            className={`
                                ${isCompleted ? 'bg-amber-400' : 'bg-purple-600'}
                                w-20 h-20 rounded-full flex items-center justify-center text-white
                                shadow-[0_8px_0_rgb(0,0,0,0.2)] border-4 border-white relative z-10 cursor-pointer
                            `}
                        >
                            {isCompleted ? <Trophy size={28} fill="white" /> : <Shield size={28} />}
                            <div className="absolute top-1 left-2 w-8 h-4 bg-white/30 rounded-full blur-[1px]" />
                            {!isCompleted && (
                                <div className="absolute -top-10 whitespace-nowrap bg-purple-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                                    CHECKPOINT
                                </div>
                            )}
                        </motion.button>
                        <div className="mt-4 relative flex items-center justify-center">
                            <span className="font-black uppercase tracking-tight text-[10px] px-3 py-1 rounded-full shadow-sm border whitespace-nowrap bg-purple-50 text-purple-700 border-purple-200">
                                {isCompleted ? 'Checkpoint Cleared!' : 'Revision Quiz'}
                            </span>
                            <button
                                onClick={e => { e.stopPropagation(); setFlagTarget({ id: parseInt(quiz.id), type: 'QUIZ', context: `Checkpoint: ${quiz.title || 'Revision Quiz'}` }); }}
                                className="absolute left-[calc(100%+8px)] text-slate-400 hover:bg-red-50 hover:text-red-500 bg-white/90 shadow-sm border border-slate-100 rounded-full p-1.5 transition-colors"
                                title="Flag this checkpoint"
                            >
                                <Flag size={14} />
                            </button>
                        </div>
                    </div>
                );
            })}
            <FlagModal
                show={flagTarget !== null}
                contentType={flagTarget?.type ?? 'LESSON'}
                contentId={flagTarget?.id ?? 0}
                context={flagTarget?.context ?? ''}
                onClose={() => setFlagTarget(null)}
            />
        </div>
    );
};

export default LessonPath;
