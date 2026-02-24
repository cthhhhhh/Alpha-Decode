import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Rocket, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { ONBOARDING_QUESTIONS } from '../constants';

interface Props {
    show: boolean;
    qIndex: number;
    score: number;
    finished: boolean;
    onAnswer: (idx: number) => void;
    onComplete: () => void;
}

const BackgroundBubble = ({ color, size, top, left, bottom, right, delay }: { color: string; size: string; top?: string; left?: string; bottom?: string; right?: string; delay: number }) => (
    <motion.div
        animate={{
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        className={`absolute rounded-full blur-[100px] opacity-10 ${color}`}
        style={{ width: size, height: size, top, left, bottom, right }}
    />
);

const OnboardingModal = ({ show, qIndex, score, finished, onAnswer, onComplete }: Props) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-slate-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
            >
                {/* Vibrant Theme-Consistent Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <BackgroundBubble color="bg-brand-primary" size="60vw" top="-10%" left="-20%" delay={0} />
                    <BackgroundBubble color="bg-brand-secondary" size="50vw" bottom="-10%" right="-10%" delay={2} />
                    <BackgroundBubble color="bg-brand-yellow" size="30vw" top="30%" left="60%" delay={4} />

                    {/* Floating Emojis in brand colors */}
                    <motion.div
                        animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-20 left-[15%] text-6xl opacity-20"
                    >
                        🧠
                    </motion.div>
                    <motion.div
                        animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
                        transition={{ duration: 7, repeat: Infinity }}
                        className="absolute bottom-40 right-[15%] text-6xl opacity-20"
                    >
                        🔥
                    </motion.div>
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-white/80 backdrop-blur-xl border-4 border-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.1)] text-center relative z-10"
                >
                    {/* Progress indicator */}
                    <div className="flex justify-center gap-3 mb-10">
                        {ONBOARDING_QUESTIONS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2.5 rounded-full transition-all duration-500 ${i === qIndex ? 'w-10 bg-brand-primary shadow-[0_0_15px_rgba(88,204,2,0.4)]' :
                                    i < qIndex ? 'w-4 bg-brand-primary/40' : 'w-4 bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {!finished ? (
                            <motion.div
                                key={qIndex}
                                initial={{ x: 60, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -60, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                className="space-y-10"
                            >
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border-2 border-brand-primary/20">
                                        <Brain size={16} />
                                        Question {qIndex + 1}
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight uppercase">
                                        BRAIN <span className="text-brand-primary italic">ROT</span> CHECK
                                    </h2>
                                    <p className="text-slate-500 text-xl font-bold leading-relaxed">{ONBOARDING_QUESTIONS[qIndex].q}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 text-left">
                                    {ONBOARDING_QUESTIONS[qIndex].options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.02, backgroundColor: 'white' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onAnswer(i)}
                                            className="group w-full p-5 rounded-2xl font-bold bg-slate-50 border-2 border-slate-200 text-slate-700 transition-all flex items-center justify-between shadow-sm hover:border-brand-primary hover:text-brand-primary"
                                        >
                                            <span className="text-lg">{opt}</span>
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                                                <ArrowRight size={18} className="group-hover:text-brand-primary" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-10 py-4"
                            >
                                <div className="relative inline-block">
                                    <div className="absolute inset-[-15px] bg-brand-yellow/20 rounded-full blur-2xl animate-pulse" />
                                    <div className="w-32 h-32 bg-brand-yellow rounded-[2.5rem] rotate-6 flex items-center justify-center text-white shadow-[0_12px_0_#d9a900] relative">
                                        <Trophy size={64} fill="currentColor" />
                                        <motion.div
                                            animate={{ y: [0, -10, 0], opacity: [1, 0.8, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-4 -right-4 bg-brand-secondary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg -rotate-12"
                                        >
                                            <Sparkles size={24} />
                                        </motion.div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-5xl font-black text-slate-900 mb-2 leading-none">VERIFIED.</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm">Level Assessment Finalized</p>
                                </div>

                                <div className="bg-brand-primary/5 rounded-[2rem] p-10 border-4 border-white shadow-inner">
                                    <p className="text-brand-primary font-black uppercase tracking-widest text-xs mb-3">Your Initial Rank</p>
                                    <div className="flex flex-col items-center">
                                        <span className="text-7xl font-black text-brand-primary tracking-tighter">LVL {score * 10 || 1}</span>
                                        <p className="text-slate-400 font-bold mt-2">{score}/{ONBOARDING_QUESTIONS.length} Questions Correct</p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05, translateY: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onComplete}
                                    className="w-full bg-brand-primary text-white py-6 rounded-[1.5rem] font-black text-2xl shadow-[0_8px_0_#46a302] hover:shadow-[0_10px_20px_rgba(88,204,2,0.3)] transition-all flex items-center justify-center gap-4 group"
                                >
                                    GET STARTED
                                    <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default OnboardingModal;
