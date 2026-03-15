import { motion } from 'motion/react';
import {
    BookOpen,
    LayoutGrid,
    Zap,
    Star,
    Flame,
    Trophy,
    Info,
    type LucideIcon,
} from 'lucide-react';
import type { Lesson } from '../types';

interface Props {
    lessons: Lesson[];
    onStart: (lessonId: string) => void;
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

const LessonPath = ({ lessons, onStart }: Props) => {
    // Only show unlocked lessons — locked ones remain completely hidden
    const visible = lessons.filter(l => !l.locked);

    // Calculate dynamic SVG path
    const generatePath = () => {
        if (visible.length === 0) return "";
        const points = visible.map((l, i) => ({
            x: 200 + (l.x || 0), // Base center is 200 in our 400px wide SVG
            y: 72 + i * 144     // Exact center: pt-8 (32) + half-button (40) = 72
        }));

        // Start from top edge
        let d = `M ${points[0].x} 0 L ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];

            // For a winding road look, we use vertical tangents at the nodes.
            // This ensures smooth entry/exit and no sharp "kinks".
            const dy = (p1.y - p0.y) * 0.5;
            const cp0x = p0.x;
            const cp0y = p0.y + dy;
            const cp1x = p1.x;
            const cp1y = p1.y - dy;

            d += ` C ${cp0x} ${cp0y}, ${cp1x} ${cp1y}, ${p1.x} ${p1.y}`;
        }

        // Add tail
        const last = points[points.length - 1];
        d += ` L ${last.x} ${last.y + 120}`;

        return d;
    };

    return (
        <div className="relative flex flex-col items-center pt-8 overflow-visible">
            {/* Floating background blobs */}
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-pink-200 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="absolute bottom-60 right-10 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="absolute top-40 left-20 w-20 h-20 bg-yellow-200 rounded-full blur-xl opacity-30 animate-pulse" />

            {/* Background dashed path — point-perfect cursive road */}
            <div className="absolute inset-0 pointer-events-none flex justify-center">
                <svg width="400" height="100%" className="opacity-20" style={{ minHeight: '100%' }}>
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

            {visible.map((lesson, i) => {
                const meta = LEVEL_META[i] ?? LEVEL_META[0];
                const { Icon } = meta;
                const isCompleted = lesson.completed;
                const isCurrent = !isCompleted;

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

                            {/* NEXT UP badge — only on first incomplete lesson */}
                            {isCurrent && i === visible.findIndex(l => !l.completed) && (
                                <div className="absolute -top-10 whitespace-nowrap bg-brand-yellow text-slate-900 text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                                    NEXT UP
                                </div>
                            )}

                            {/* Level number bubble */}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-xs border-2 border-slate-200 shadow-sm">
                                {i + 1}
                            </div>
                        </motion.button>

                        <span className="mt-4 font-black uppercase tracking-tight text-[10px] px-3 py-1 rounded-full shadow-sm border whitespace-nowrap bg-white/90 text-slate-600 border-slate-100">
                            {lesson.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default LessonPath;
