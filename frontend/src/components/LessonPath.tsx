import { useState, useEffect, useRef } from 'react';
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
    Lock,
    type LucideIcon,
} from 'lucide-react';
import type { Lesson, RevisionQuiz } from '../types';
import FlagModal from './FlagModal';
import Avatar from './avatar/Avatar';

interface Props {
    lessons: Lesson[];
    onStart: (lessonId: string) => void;
    revisionQuizzes: RevisionQuiz[];
    completedRevisionIds: Set<string>;
    onStartRevision: (quiz: RevisionQuiz) => void;
    faceId?: string | null;
    bodyTypeId?: string | null;
    hairId?: string | null;
    equippedOutfitId?: number | null;
    equippedPetId?: number | null;
    itemAssetMap?: Record<number, string>;
    maxUnlockedLessonIndex?: number;
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
    | { kind: 'lesson'; lesson: Lesson; visibleIndex: number; isLocked: boolean }
    | { kind: 'checkpoint'; quiz: RevisionQuiz; isCompleted: boolean; isLocked: boolean };

const LessonPath = ({ lessons, onStart, revisionQuizzes, completedRevisionIds, onStartRevision, faceId, bodyTypeId, hairId, equippedOutfitId, equippedPetId, itemAssetMap = {} }: Props) => {
    const [flagTarget, setFlagTarget] = useState<{ id: number; type: 'LESSON' | 'QUIZ'; context: string } | null>(null);
    const [isWalking, setIsWalking] = useState(false);

    const buildNodes = (): PathNode[] => {
        const nodes: PathNode[] = [];
        let visibleIdx = 0;
        let pathBlocked = false; // true after an incomplete checkpoint

        for (let originalIdx = 0; originalIdx < lessons.length; originalIdx++) {
            const lesson = lessons[originalIdx];
            const lessonLocked = lesson.locked || pathBlocked;

            nodes.push({ kind: 'lesson', lesson, visibleIndex: visibleIdx++, isLocked: lessonLocked });

            const checkpoint = revisionQuizzes.find(rq => rq.afterLessonIndex === originalIdx);
            if (checkpoint) {
                const isCompleted = completedRevisionIds.has(checkpoint.id.toString());
                // Checkpoint is locked if its lesson wasn't completed, or path already blocked
                const checkpointLocked = !lesson.completed || pathBlocked;
                nodes.push({ kind: 'checkpoint', quiz: checkpoint, isCompleted, isLocked: checkpointLocked });
                // Block the path only when the lesson was done but checkpoint not yet
                if (lesson.completed && !isCompleted) {
                    pathBlocked = true;
                }
            }
        }
        return nodes;
    };

    const nodes = buildNodes();

    // Walking animation: detect when the avatar's current node changes
    const unlockedLessonsForWalk = nodes
        .filter(n => n.kind === 'lesson' && !(n as { kind: 'lesson'; isLocked: boolean }).isLocked)
        .map(n => (n as { kind: 'lesson'; lesson: Lesson; visibleIndex: number }).lesson);
    const firstIncompleteLessonForWalk = unlockedLessonsForWalk.find(l => !l.completed);
    const avatarLessonId = firstIncompleteLessonForWalk?.id ?? null;
    const prevAvatarLessonIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (avatarLessonId === null) {
            prevAvatarLessonIdRef.current = null;
            return;
        }
        if (prevAvatarLessonIdRef.current !== null && prevAvatarLessonIdRef.current !== avatarLessonId) {
            setIsWalking(true);
            const t = setTimeout(() => setIsWalking(false), 1200);
            prevAvatarLessonIdRef.current = avatarLessonId;
            return () => clearTimeout(t);
        }
        prevAvatarLessonIdRef.current = avatarLessonId;
    }, [avatarLessonId]);

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
                    const { lesson, visibleIndex, isLocked } = node;
                    const meta = LEVEL_META[visibleIndex] ?? LEVEL_META[0];
                    const { Icon } = meta;
                    const isCompleted = lesson.completed;
                    const isCurrent = !isCompleted && !isLocked;
                    const firstIncompleteIndex = nodes
                        .filter(n => n.kind === 'lesson' && !(n as { kind: 'lesson'; isLocked: boolean }).isLocked)
                        .findIndex(n => !(n as { kind: 'lesson'; lesson: Lesson }).lesson.completed);

                    // Show avatar beside the current (first accessible incomplete) lesson
                    const isAvatarNode = isCurrent && nodes.filter(n => n.kind === 'lesson' && !(n as { kind: 'lesson'; isLocked: boolean }).isLocked).indexOf(node) === firstIncompleteIndex && faceId;

                    return (
                        <div
                            key={lesson.id}
                            className="flex flex-col items-center mt-16 first:mt-0"
                            style={{ transform: `translateX(${lesson.x}px)` }}
                        >
                            {/* Relative wrapper scoped to the circle so avatar positioning uses circle bounds */}
                            <div className="relative">
                            {isAvatarNode && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    className="absolute z-20 pointer-events-none"
                                    style={{ bottom: 0, left: '100%', transform: 'translate(8px, 0)' }}
                                >
                                    <motion.div
                                        animate={isWalking
                                            ? { y: [0, -7, 0, -7, 0, -7, 0], rotate: [0, -4, 0, 4, 0, -4, 0] }
                                            : { y: 0, rotate: 0 }}
                                        transition={isWalking
                                            ? { duration: 1.0, ease: 'easeInOut' }
                                            : { duration: 0.2 }}
                                    >
                                        <Avatar
                                            faceId={faceId}
                                            bodyTypeId={bodyTypeId}
                                            hairId={hairId}
                                            outfitAssetId={equippedOutfitId ? itemAssetMap[equippedOutfitId] : null}
                                            petAssetId={equippedPetId ? itemAssetMap[equippedPetId] : null}
                                            size="sm"
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                            <motion.button
                                whileHover={isLocked ? {} : { scale: 1.1, rotate: 5 }}
                                whileTap={isLocked ? {} : { scale: 0.9 }}
                                onClick={isLocked ? undefined : () => onStart(lesson.id)}
                                className={`
                                    ${isCompleted ? 'bg-brand-primary' : isLocked ? 'bg-slate-300' : meta.color}
                                    w-20 h-20 rounded-full flex items-center justify-center text-white
                                    shadow-[0_8px_0_rgb(0,0,0,0.2)] border-4 border-white relative z-10
                                    ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                                `}
                            >
                                {isCompleted ? <Trophy size={28} fill="white" /> : isLocked ? <Lock size={28} /> : <Icon size={28} />}

                                {/* Glossy sheen */}
                                <div className="absolute top-1 left-2 w-8 h-4 bg-white/30 rounded-full blur-[1px]" />

                                {/* NEXT UP badge */}
                                {isCurrent && (
                                    <div className="absolute -top-10 whitespace-nowrap bg-brand-yellow text-slate-900 text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                                        NEXT UP
                                    </div>
                                )}

                                {/* Level number bubble */}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-xs border-2 border-slate-200 shadow-sm">
                                    {visibleIndex + 1}
                                </div>
                            </motion.button>
                            </div>{/* end circle relative wrapper */}

                            <div className="mt-4 relative flex items-center justify-center">
                                <span className={`font-black uppercase tracking-tight text-[10px] px-3 py-1 rounded-full shadow-sm border whitespace-nowrap ${isLocked ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-white/90 text-slate-600 border-slate-100'}`}>
                                    {lesson.title}
                                </span>
                                {!isLocked && (
                                    <button
                                        onClick={e => { e.stopPropagation(); setFlagTarget({ id: parseInt(lesson.id), type: 'LESSON', context: `Lesson: ${lesson.title}` }); }}
                                        className="absolute left-[calc(100%+8px)] text-slate-400 hover:bg-red-50 hover:text-red-500 bg-white/90 shadow-sm border border-slate-100 rounded-full p-1.5 transition-colors"
                                        title="Flag this lesson"
                                    >
                                        <Flag size={14} />
                                    </button>
                                )}
                            </div>

                        </div>
                    );
                }

                // Checkpoint node
                const { quiz, isCompleted, isLocked: checkpointLocked } = node;
                return (
                    <div key={`checkpoint-${quiz.id}-${i}`} className="relative flex flex-col items-center mt-16" style={{ transform: 'translateX(0px)' }}>
                        <motion.button
                            whileHover={checkpointLocked ? {} : { scale: 1.1, rotate: -5 }}
                            whileTap={checkpointLocked ? {} : { scale: 0.9 }}
                            onClick={checkpointLocked ? undefined : () => onStartRevision(quiz)}
                            className={`
                                ${isCompleted ? 'bg-amber-400' : checkpointLocked ? 'bg-slate-300' : 'bg-purple-600'}
                                w-20 h-20 rounded-full flex items-center justify-center text-white
                                shadow-[0_8px_0_rgb(0,0,0,0.2)] border-4 border-white relative z-10
                                ${checkpointLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                            `}
                        >
                            {isCompleted ? <Trophy size={28} fill="white" /> : checkpointLocked ? <Lock size={28} /> : <Shield size={28} />}
                            <div className="absolute top-1 left-2 w-8 h-4 bg-white/30 rounded-full blur-[1px]" />
                            {!isCompleted && !checkpointLocked && (
                                <div className="absolute -top-10 whitespace-nowrap bg-purple-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                                    CHECKPOINT
                                </div>
                            )}
                        </motion.button>
                        <div className="mt-4 relative flex items-center justify-center">
                            <span className={`font-black uppercase tracking-tight text-[10px] px-3 py-1 rounded-full shadow-sm border whitespace-nowrap ${
                                isCompleted ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : checkpointLocked ? 'bg-slate-50 text-slate-400 border-slate-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                                {isCompleted ? 'Checkpoint Cleared!' : checkpointLocked ? 'Locked' : 'Revision Quiz'}
                            </span>
                            {!checkpointLocked && (
                                <button
                                    onClick={e => { e.stopPropagation(); setFlagTarget({ id: parseInt(quiz.id), type: 'QUIZ', context: `Checkpoint: ${quiz.title || 'Revision Quiz'}` }); }}
                                    className="absolute left-[calc(100%+8px)] text-slate-400 hover:bg-red-50 hover:text-red-500 bg-white/90 shadow-sm border border-slate-100 rounded-full p-1.5 transition-colors"
                                    title="Flag this checkpoint"
                                >
                                    <Flag size={14} />
                                </button>
                            )}
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
