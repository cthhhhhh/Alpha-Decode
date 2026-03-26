import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, XCircle, Trophy, Star, Shield, Flag } from 'lucide-react';
import FlagModal from './FlagModal';
import type { RevisionQuiz } from '../types';

interface Props {
    quiz: RevisionQuiz;
    onClose: () => void;
    onComplete: (correct: number, total: number) => void;
}

// ── Fireworks canvas (reused from DailyQuizModal) ──────────────────────────
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

// ── QuestionView ───────────────────────────────────────────────────────────
const QuestionView = ({ question, qIndex, total, selected, isChecked, isCorrect, onSelect, onCheck, onNext, onFlag }:
    { question: { id?: number; title: string; options: string[]; correctAnswer: number; explanation: string }; qIndex: number; total: number; selected: number | null; isChecked: boolean; isCorrect: boolean; onSelect: (i: number) => void; onCheck: () => void; onNext: () => void; onFlag: (id: number) => void }
) => (
    <motion.div key={qIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }} className="space-y-4">

        <div className="flex items-center gap-3">
            <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-purple-200">🛡️ Revision</span>
            <div className="ml-auto flex items-center gap-2">
                <span className="text-slate-400 font-bold text-sm">Question {qIndex + 1} of {total}</span>
                {question.id && (
                    <button
                        onClick={() => onFlag(question.id!)}
                        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group"
                        title="Flag this question"
                    >
                        <Flag size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-7 border-2 border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">{question.title}</h2>
        </div>

        <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => (
                <AnswerOption key={idx} opt={opt} idx={idx}
                    isSelected={selected === idx} isChecked={isChecked}
                    isCorrect={isChecked && idx === question.correctAnswer}
                    isWrong={isChecked && selected === idx && idx !== question.correctAnswer}
                    isDimmed={isChecked && idx !== question.correctAnswer && !(selected === idx && idx !== question.correctAnswer)}
                    onSelect={onSelect} />
            ))}
        </div>

        <AnimatePresence>
            {isChecked && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border-2 ${isCorrect ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        {isCorrect ? <CheckCircle2 className="text-green-500 shrink-0" size={20} /> : <XCircle className="text-red-400 shrink-0" size={20} />}
                        <p className="font-black text-base">{isCorrect ? "YOU'RE BUILT DIFFERENT FR ✅" : 'COOKED 💀 NOT EVEN CLOSE'}</p>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{question.explanation}</p>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={isChecked ? onNext : onCheck} disabled={selected === null && !isChecked}
            className={`w-full py-4 rounded-2xl font-black text-xl text-white transition-all ${selected !== null || isChecked ? 'bg-purple-600 shadow-[0_5px_0_#7c3aed] active:translate-y-1 active:shadow-none' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
            {isChecked ? (qIndex + 1 >= total ? 'SEE RESULTS' : 'NEXT →') : 'CHECK'}
        </motion.button>
    </motion.div>
);

// ── ResultScreen ───────────────────────────────────────────────────────────
const ResultScreen = ({ correctCount, total, answerLog, onClose }:
    { correctCount: number; total: number; answerLog: boolean[]; onClose: () => void }
) => {
    const isPerfect = correctCount === total;
    return (
        <motion.div key="result" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="flex flex-col items-center text-center space-y-6 py-6">

            <motion.div animate={{ rotate: [0, -8, 8, -4, 4, 0] }} transition={{ duration: 0.6, delay: 0.2 }}
                className={`w-28 h-28 rounded-[2rem] flex items-center justify-center shadow-xl ${isPerfect ? 'bg-amber-400' : 'bg-purple-100'}`}>
                {isPerfect
                    ? <Trophy size={56} fill="white" className="text-white" />
                    : <Shield size={56} className="text-purple-400" />
                }
            </motion.div>

            <div>
                <h2 className="text-4xl font-black text-slate-900 mb-1">
                    {isPerfect ? 'CHECKPOINT CLEARED! 🎉' : 'KEEP PRACTICING'}
                </h2>
                <p className="text-slate-500 font-bold text-lg">{correctCount} / {total} correct</p>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
                {answerLog.map((ok, i) => (
                    <div key={i} className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 ${ok ? 'bg-green-50 border-green-300 text-green-600' : 'bg-red-50 border-red-300 text-red-500'}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase">Q{i + 1}</span>
                        <span className="text-xl font-black">{ok ? '✓' : '✗'}</span>
                    </div>
                ))}
            </div>

            <div className="w-full max-w-sm rounded-3xl p-6 border-2 text-center bg-purple-50 border-purple-200">
                {correctCount > 0 ? (
                    <>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Star size={28} className="text-brand-yellow" fill="currentColor" />
                            <span className="text-3xl font-black text-purple-700">+{correctCount} Stars earned</span>
                        </div>
                        <p className="text-purple-500 font-bold text-sm">1 Star per correct answer</p>
                    </>
                ) : (
                    <p className="text-slate-500 font-bold">No stars this time — give it another shot!</p>
                )}
            </div>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                className="w-full max-w-sm bg-purple-600 text-white py-5 rounded-2xl font-black text-xl shadow-[0_6px_0_#7c3aed] active:translate-y-1 active:shadow-none transition-all">
                CONTINUE
            </motion.button>
        </motion.div>
    );
};

// ── RevisionQuizModal ──────────────────────────────────────────────────────
const RevisionQuizModal = ({ quiz, onClose, onComplete }: Props) => {
    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [answerLog, setAnswerLog] = useState<boolean[]>([]);
    const [finished, setFinished] = useState(false);
    const [showFlag, setShowFlag] = useState(false);
    const [flagId, setFlagId] = useState<number>(0);

    const questions = quiz.questions;
    const total = questions.length;
    const question = questions[qIndex];
    const isCorrect = selected !== null && selected === question.correctAnswer;
    const isPerfect = correctCount === total;
    const isShowingConfetti = finished && isPerfect;

    const handleCheck = () => {
        if (selected === null) return;
        const correct = selected === question.correctAnswer;
        if (correct) setCorrectCount(c => c + 1);
        setAnswerLog(prev => [...prev, correct]);
        setIsChecked(true);
    };

    const handleNext = () => {
        if (qIndex + 1 < total) { setQIndex(i => i + 1); setSelected(null); setIsChecked(false); }
        else setFinished(true);
    };

    const handleFinishClose = () => {
        onComplete(correctCount, total);
        // reset internal state for next open
        setQIndex(0); setSelected(null); setIsChecked(false);
        setCorrectCount(0); setAnswerLog([]); setFinished(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col">
            <FireworksCanvas active={isShowingConfetti} />

            {/* Header */}
            <div className="w-full px-4 pt-6 pb-4 flex items-center gap-4 max-w-3xl mx-auto">
                <button onClick={finished ? handleFinishClose : onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={26} />
                </button>
                <div className="flex items-center gap-2 mr-2">
                    <Shield size={20} className="text-purple-600" />
                    <span className="font-black text-purple-700 uppercase tracking-wider text-sm">Checkpoint Quiz</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                    {Array.from({ length: total }).map((_, i) => (
                        <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${finished || i <= qIndex ? 'bg-purple-500' : 'bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <AnimatePresence mode="wait">
                        {finished
                            ? <ResultScreen correctCount={correctCount} total={total} answerLog={answerLog} onClose={handleFinishClose} />
                            : <QuestionView question={question} qIndex={qIndex} total={total} selected={selected} isChecked={isChecked} isCorrect={isCorrect} onSelect={setSelected} onCheck={handleCheck} onNext={handleNext} 
                                onFlag={(id) => { setFlagId(id); setShowFlag(true); }} />
                        }
                    </AnimatePresence>
                </div>
            </div>

            <FlagModal
                show={showFlag}
                contentType="QUESTION"
                contentId={flagId}
                onClose={() => setShowFlag(false)}
            />
        </motion.div>
    );
};

export default RevisionQuizModal;
