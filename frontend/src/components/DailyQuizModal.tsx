import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, XCircle, Trophy, Coins, Flame, Flag } from 'lucide-react';
import FlagModal from './FlagModal';

interface Props {
    show: boolean;
    onClose: () => void;
    onComplete: (correct: number, total: number) => void;
    questions: { id: number; q: string; options: string[]; correct: number; explanation: string }[];
}

// ── Fireworks canvas ───────────────────────────────────────────────────────
const COLORS = ['#58cc02', '#ffd900', '#ff4b4b', '#1cb0f6', '#ce82ff', '#ff9600', '#ff6b00', '#00cd9c'];

const FireworksCanvas = ({ active }: { active: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        type P = { x: number; y: number; vx: number; vy: number; color: string; alpha: number; size: number; isConfetti: boolean; rotation: number; rotationSpeed: number };
        type R = { x: number; y: number; vy: number; targetY: number; color: string };

        const ps: P[] = [], rs: R[] = [];
        const rand = (a: number, b: number) => Math.random() * (b - a) + a;
        const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)];

        const burst = (px: number, py: number) => {
            for (let i = 0; i < 60; i++) {
                const a = (i / 60) * Math.PI * 2, s = rand(3, 9);
                ps.push({ x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s, color: pick(), alpha: 1, size: rand(3, 6), isConfetti: false, rotation: 0, rotationSpeed: 0 });
            }
        };

        for (let i = 0; i < 80; i++)
            ps.push({ x: rand(0, canvas.width), y: rand(-100, 0), vx: rand(-1.5, 1.5), vy: rand(2, 5), color: pick(), alpha: 1, size: rand(6, 12), isConfetti: true, rotation: rand(0, Math.PI * 2), rotationSpeed: rand(-0.12, 0.12) });

        let tick = 0;
        const loop = () => {
            rafRef.current = requestAnimationFrame(loop);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (++tick % 50 === 0)
                rs.push({ x: rand(canvas.width * 0.15, canvas.width * 0.85), y: canvas.height, vy: rand(-18, -12), targetY: rand(canvas.height * 0.1, canvas.height * 0.45), color: pick() });

            for (let i = rs.length - 1; i >= 0; i--) {
                const r = rs[i]; r.y += r.vy;
                ctx.beginPath(); ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = r.color; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
                if (r.y <= r.targetY) { burst(r.x, r.y); rs.splice(i, 1); }
            }

            for (let i = ps.length - 1; i >= 0; i--) {
                const p = ps[i]; p.x += p.vx; p.y += p.vy;
                if (p.isConfetti) { p.vy += 0.06; p.rotation += p.rotationSpeed; if (p.y > canvas.height) p.y = -20; }
                else { p.vy += 0.25; p.alpha -= 0.018; }
                if (p.alpha <= 0) { ps.splice(i, 1); continue; }
                ctx.save(); ctx.globalAlpha = p.alpha;
                if (p.isConfetti) { ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
                else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill(); }
                ctx.restore();
            }
        };

        setTimeout(() => {
            rs.push({ x: rand(canvas.width * 0.25, 0.45 * canvas.width), y: canvas.height, vy: -16, targetY: canvas.height * 0.25, color: pick() });
            rs.push({ x: rand(0.55 * canvas.width, canvas.width * 0.75), y: canvas.height, vy: -15, targetY: canvas.height * 0.30, color: pick() });
        }, 100);

        loop();
        return () => { cancelAnimationFrame(rafRef.current); ctx.clearRect(0, 0, canvas.width, canvas.height); };
    }, [active]);

    if (!active) return null;
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[90]" style={{ width: '100vw', height: '100vh' }} />;
};

// ── AnswerOption ───────────────────────────────────────────────────────────
const AnswerOption = ({ opt, idx, isSelected, isChecked, isCorrect, isWrong, isDimmed, onSelect }:
    { opt: string; idx: number; isSelected: boolean; isChecked: boolean; isCorrect: boolean; isWrong: boolean; isDimmed: boolean; onSelect: (i: number) => void }
) => {
    const green = 'bg-green-50 border-green-400 text-green-500';
    const btnCls = isWrong ? 'bg-red-50 border-red-400 text-red-800' : (isCorrect || isSelected) ? green : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50';
    const numCls = isCorrect ? 'text-green-500' : isWrong ? 'text-red-400' : 'text-slate-400';

    return (
        <button onClick={() => !isChecked && onSelect(idx)} disabled={isChecked}
            className={`w-full flex items-center gap-4 px-5 py-5 rounded-2xl border-2 font-bold text-left transition-all ${btnCls} ${isDimmed ? 'opacity-40' : ''}`}>
            <span className={`text-sm font-black shrink-0 w-5 text-center ${numCls}`}>{isCorrect ? '✓' : isWrong ? '✗' : idx + 1}</span>
            <span className="text-lg font-bold leading-snug">{opt}</span>
        </button>
    );
};

const CORRECT_MSGS = [
    "YOU'RE BUILT DIFFERENT FR ✅",
    "NO CAP THAT'S RIGHT 🔥",
    "SLAY BESTIE ✨",
    "UNDERSTOOD THE ASSIGNMENT 💯",
    "W ANSWER FR FR 🎯",
    "SIGMA MOVE 👑",
];
const WRONG_MSGS = [
    'COOKED 💀 NOT EVEN CLOSE',
    'L + RATIO 💀',
    'OHIO MOMENT 😭',
    "MAJOR DELULU 😤",
    'THAT AIN\'T IT FR 🫠',
    'SKIBIDI FAIL 💀',
];

// ── QuestionView ───────────────────────────────────────────────────────────
const QuestionView = ({ question, qIndex, total, selected, isChecked, isCorrect, onSelect, onCheck, onNext, onFlag }:
    { question: { id: number; q: string; options: string[]; correct: number; explanation: string }; qIndex: number; total: number; selected: number | null; isChecked: boolean; isCorrect: boolean; onSelect: (i: number) => void; onCheck: () => void; onNext: () => void; onFlag: (id: number) => void }
) => (
    <motion.div key={qIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }} className="space-y-4">

        <div className="flex items-center justify-between gap-3">
            <span className="bg-brand-primary/10 text-brand-primary text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-brand-primary/20">🔥 Daily Challenge</span>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold text-sm">Question {qIndex + 1} of {total}</span>
                <button
                    onClick={() => onFlag(question.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group"
                    title="Flag this question"
                >
                    <Flag size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-7 border-2 border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">{question.q}</h2>
        </div>

        <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => (
                <AnswerOption key={idx} opt={opt} idx={idx}
                    isSelected={selected === idx} isChecked={isChecked}
                    isCorrect={isChecked && idx === question.correct}
                    isWrong={isChecked && selected === idx && idx !== question.correct}
                    isDimmed={isChecked && idx !== question.correct && !(selected === idx && idx !== question.correct)}
                    onSelect={onSelect} />
            ))}
        </div>

        <AnimatePresence>
            {isChecked && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border-2 ${isCorrect ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        {isCorrect ? <CheckCircle2 className="text-green-500 shrink-0" size={20} /> : <XCircle className="text-red-400 shrink-0" size={20} />}
                        <p className="font-black text-base">{isCorrect ? CORRECT_MSGS[qIndex % CORRECT_MSGS.length] : WRONG_MSGS[qIndex % WRONG_MSGS.length]}</p>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{question.explanation}</p>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={isChecked ? onNext : onCheck} disabled={selected === null && !isChecked}
            className={`w-full py-4 rounded-2xl font-black text-xl text-white transition-all ${selected !== null || isChecked ? 'bg-brand-primary shadow-[0_5px_0_#46a302] active:translate-y-1 active:shadow-none' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
            {isChecked ? (qIndex + 1 >= total ? 'SEE RESULTS' : 'NEXT →') : 'CHECK'}
        </motion.button>
    </motion.div>
);

// ── ResultScreen ───────────────────────────────────────────────────────────
const ResultScreen = ({ correctCount, total, answerLog, onClose }:
    { correctCount: number; total: number; answerLog: boolean[]; onClose: () => void }
) => {
    const accuracy = total === 0 ? 100 : Math.round((correctCount / total) * 100);
    const isPerfect = accuracy === 100;

    let title = "KEEP PRACTICING";
    let subtitle = "You're leveling up your brain.";

    if (accuracy === 100) {
        title = "YOU ATE NO CAP!";
        subtitle = "Absolute Sigma! +10 Coins & +1 Streak.";
    } else if (accuracy >= 80) {
        title = "ALMOST COOKED FR";
        subtitle = "So close to a perfect streak! Try again.";
    } else if (accuracy >= 60) {
        title = "Delulu Moment?";
        subtitle = "The delulu is not the solulu. No rewards.";
    } else {
        title = "L + RATIO";
        subtitle = "Total Ohio energy. Skibidi 101 calls...";
    }

    return (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-10">

            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-6 ${isPerfect ? 'bg-brand-yellow animate-bounce' : 'bg-slate-100'}`}>
                {isPerfect ? <Trophy size={48} fill="currentColor" /> : <Flame size={48} className="text-orange-400" />}
            </div>

            <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-xl text-brand-primary font-bold">{subtitle}</p>
            </div>

            {/* Questions Grid Log */}
            <div className="flex flex-wrap gap-2 justify-center">
                {answerLog.map((ok, i) => (
                    <div key={i} className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 transition-transform hover:scale-103 ${ok ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-500'}`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Q{i + 1}</span>
                        <span className="text-lg font-black leading-none">{ok ? '✓' : '✗'}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-3xl font-black text-brand-primary">{accuracy}%</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Rewards</p>
                    {isPerfect ? (
                        <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1">
                                <Coins size={20} className="text-brand-yellow" />
                                <span className="text-xl font-black text-brand-primary">+10</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <Flame size={18} className="text-orange-400" fill="currentColor" />
                                <span className="text-lg font-bold text-orange-400">+1 Streak</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-[10px] font-black text-slate-400 uppercase leading-tight">
                            100% Correct <br />Required for Rewards
                        </div>
                    )}
                </div>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose}
                className="w-full max-w-sm bg-brand-primary text-white py-5 rounded-2xl font-black text-xl shadow-[0_6px_0_#46a302] active:translate-y-1 active:shadow-none transition-all">
                CONTINUE
            </motion.button>
        </motion.div>
    );
};

// ── DailyQuizModal ─────────────────────────────────────────────────────────
const DailyQuizModal = ({ show, onClose, onComplete, questions }: Props) => {
    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [answerLog, setAnswerLog] = useState<boolean[]>([]);
    const [finished, setFinished] = useState(false);
    const [showFlag, setShowFlag] = useState(false);
    const [flagId, setFlagId] = useState<number>(0);

    const total = questions.length;
    const question = questions[qIndex];
    const isCorrect = !!question && selected !== null && selected === question.correct;
    const isPerfect = total > 0 && correctCount === total;
    const isShowingConfetti = finished && isPerfect;

    const handleCheck = () => {
        if (!question || selected === null) return;
        const correct = selected === question.correct;
        if (correct) setCorrectCount(c => c + 1);
        setAnswerLog(prev => [...prev, correct]);
        setIsChecked(true);
    };

    const handleNext = () => {
        if (qIndex + 1 < total) { setQIndex(i => i + 1); setSelected(null); setIsChecked(false); }
        else setFinished(true);
    };

    const handleFinishClose = () => { onComplete(correctCount, total); };

    const handleReset = () => {
        setQIndex(0); setSelected(null); setIsChecked(false);
        setCorrectCount(0); setAnswerLog([]); setFinished(false);
    };

    // If something tries to open the modal without loaded questions, close immediately
    // (prevents rendering with an undefined `question`).
    useEffect(() => {
        if (show && (!questions || questions.length === 0 || !question)) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, questions.length, qIndex]);

    return (
        <AnimatePresence onExitComplete={handleReset}>
            {show && (
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <FireworksCanvas active={isShowingConfetti} />

                    {/* Header */}
                    <div className="w-full px-4 pt-6 pb-4 flex items-center gap-4 max-w-3xl mx-auto">
                        <button onClick={finished ? handleFinishClose : onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={26} />
                        </button>
                        <div className="flex-1 flex items-center gap-2">
                            {Array.from({ length: total }).map((_, i) => (
                                <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${finished || i <= qIndex ? 'bg-brand-primary' : 'bg-slate-200'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto px-4 py-4">
                            <AnimatePresence mode="wait">
                                {finished ? (
                                    <ResultScreen correctCount={correctCount} total={total} answerLog={answerLog} onClose={handleFinishClose} />
                                ) : question ? (
                                    <QuestionView
                                        question={question}
                                        qIndex={qIndex}
                                        total={total}
                                        selected={selected}
                                        isChecked={isChecked}
                                        isCorrect={isCorrect}
                                        onSelect={setSelected}
                                        onCheck={handleCheck}
                                        onNext={handleNext}
                                        onFlag={(id) => { setFlagId(id); setShowFlag(true); }}
                                    />
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </div>

                    <FlagModal
                        show={showFlag}
                        contentType="QUESTION"
                        contentId={flagId}
                        context={question ? `Daily Quiz - "${question.q}"` : 'Daily Quiz'}
                        onClose={() => setShowFlag(false)}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DailyQuizModal;
