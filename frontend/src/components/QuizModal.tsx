import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';
import { QUIZ_QUESTIONS, XP_PER_CORRECT, PASS_THRESHOLD } from '../data';

interface ActiveQuiz {
    lessonId: string;
    qIndex: number;
    show: boolean;
    correctCount: number;
}

interface QuizResult {
    correct: number;
    total: number;
    xpEarned: number;
}

interface Props {
    activeQuiz: ActiveQuiz;
    selectedOption: number | null;
    isCorrect: boolean | null;
    quizCompleted: boolean;
    quizResult: QuizResult | null;
    onClose: () => void;
    onOptionSelect: (idx: number) => void;
    onNext: () => void;
}

const QuizModal = ({
    activeQuiz,
    selectedOption,
    isCorrect,
    quizCompleted,
    quizResult,
    onClose,
    onOptionSelect,
    onNext,
}: Props) => {
    const questions = QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'];
    const currentQuestion = questions[activeQuiz.qIndex];
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white flex flex-col"
            >
                {/* Header bar */}
                <div className="max-w-4xl mx-auto w-full px-4 py-6 flex items-center gap-4">
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={28} />
                    </button>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-brand-primary"
                            initial={{ width: 0 }}
                            animate={{
                                width: quizCompleted
                                    ? '100%'
                                    : `${((activeQuiz.qIndex + 1) / (questions.length || 1)) * 100}%`,
                            }}
                        />
                    </div>
                    <span className="font-black text-brand-primary">
                        {activeQuiz.correctCount * XP_PER_CORRECT} PTS
                    </span>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-2xl mx-auto px-4 py-8">

                        {quizCompleted && quizResult ? (
                            /* ── Result screen ── */
                            <div className="text-center py-4">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${quizResult.correct / quizResult.total === 1
                                    ? 'bg-brand-yellow/20 text-brand-yellow'
                                    : quizResult.correct / quizResult.total >= PASS_THRESHOLD
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'bg-brand-accent/10 text-brand-accent'
                                    }`}>
                                    <Trophy size={40} fill="currentColor" />
                                </div>

                                <h3 className="text-3xl font-black text-slate-800 mb-1">
                                    {quizResult.correct / quizResult.total === 1
                                        ? 'Perfect Score! 🏆'
                                        : quizResult.correct / quizResult.total >= PASS_THRESHOLD
                                            ? 'Lesson Passed!'
                                            : 'Keep Practicing!'}
                                </h3>
                                <p className="text-slate-500 font-medium mb-6">
                                    {quizResult.correct}/{quizResult.total} correct
                                </p>

                                <div className="bg-brand-yellow/10 border-2 border-brand-yellow/30 rounded-2xl p-4 mb-4 flex items-center justify-center gap-3">
                                    <Star size={24} className="text-brand-yellow" fill="currentColor" />
                                    <span className="text-2xl font-black text-slate-800">+{quizResult.xpEarned} XP earned</span>
                                </div>

                                {quizResult.correct / quizResult.total === 1 && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm font-bold text-green-700">
                                        🎉 Perfect! This lesson is now complete and locked.
                                    </div>
                                )}
                                {quizResult.correct / quizResult.total >= PASS_THRESHOLD && quizResult.correct / quizResult.total < 1 && (
                                    <div className="bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl p-3 mb-4 text-sm font-bold text-brand-secondary">
                                        🔓 Next lesson unlocked!
                                    </div>
                                )}
                                {quizResult.correct / quizResult.total < PASS_THRESHOLD && (
                                    <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-3 mb-4 text-sm font-bold text-brand-accent">
                                        You need 75% to unlock the next lesson. Try again!
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-xl hover:bg-brand-primary/90 transition-colors shadow-[0_6px_0_#46a302] active:translate-y-1 active:shadow-none"
                                >
                                    CONTINUE
                                </button>
                            </div>

                        ) : (
                            /* ── Question screen — matches CS203T1-main QuizMode exactly ── */
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-black text-slate-400">
                                        QUESTION {activeQuiz.qIndex + 1} OF {questions.length}
                                    </span>
                                </div>

                                <h2 className="text-3xl font-black mb-12 text-center">{currentQuestion.q}</h2>

                                {/* 2×2 Kahoot grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => onOptionSelect(idx)}
                                            disabled={selectedOption !== null}
                                            className={`
                        kahoot-btn p-6 rounded-2xl text-white font-bold text-xl text-left
                        flex items-center justify-between
                        ${selectedOption === idx ? 'ring-4 ring-slate-900 ring-offset-2' : ''}
                        ${selectedOption !== null && idx === currentQuestion.correct
                                                    ? 'bg-green-500'
                                                    : selectedOption === idx
                                                        ? 'bg-red-500'
                                                        : colors[idx]}
                        ${selectedOption !== null && idx !== currentQuestion.correct && selectedOption !== idx
                                                    ? 'opacity-50 grayscale' : ''}
                      `}
                                        >
                                            <span>{option}</span>
                                            {selectedOption !== null && idx === currentQuestion.correct && <CheckCircle2 />}
                                            {selectedOption === idx && idx !== currentQuestion.correct && <XCircle />}
                                        </button>
                                    ))}
                                </div>

                                {/* Inline feedback — identical to CS203T1-main */}
                                <AnimatePresence>
                                    {selectedOption !== null && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-6 rounded-2xl mb-8 border-2 ${isCorrect
                                                ? 'bg-green-50 border-green-200 text-green-800'
                                                : 'bg-red-50 border-red-200 text-red-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                {isCorrect
                                                    ? <CheckCircle2 className="text-green-500" size={24} />
                                                    : <XCircle className="text-red-500" size={24} />}
                                                <p className="font-black text-lg">
                                                    {isCorrect ? 'AMAZING RIZZ!' : 'L + RATIO...'}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">
                                                {isCorrect ? (
                                                    <span>
                                                        That's right! <span className="font-bold">{currentQuestion.options[currentQuestion.correct]}</span> is the correct term. {currentQuestion.explanation}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        Not quite. You chose{' '}
                                                        <span className="font-bold line-through opacity-60">
                                                            {selectedOption !== null ? currentQuestion.options[selectedOption] : ''}
                                                        </span>, but the correct answer is{' '}
                                                        <span className="font-bold underline">
                                                            {currentQuestion.options[currentQuestion.correct]}
                                                        </span>. {currentQuestion.explanation}
                                                    </span>
                                                )}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {selectedOption !== null && (
                                    <button
                                        onClick={onNext}
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xl hover:bg-slate-800 transition-colors"
                                    >
                                        {activeQuiz.qIndex + 1 >= (questions.length || 0) ? 'FINISH' : 'NEXT'}
                                    </button>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuizModal;
