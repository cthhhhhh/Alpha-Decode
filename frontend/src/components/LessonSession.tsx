import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, Star, Trophy } from 'lucide-react';
import { LESSON_CONTENT } from '../data';

interface Props {
    lessonId: string;
    initialCompleted: boolean;
    onClose: () => void;
    onComplete: (id: string, correct: number, total: number) => void;
}

const LessonSession = ({ lessonId, initialCompleted, onClose, onComplete }: Props) => {
    const lesson = LESSON_CONTENT.find(l => l.id === lessonId);
    const [stepIdx, setStepIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [wordBankSelection, setWordBankSelection] = useState<string[]>([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    // Track score for graded steps (select + translate)
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    if (!lesson) return null;

    const step = lesson.steps[stepIdx];

    const totalGraded = lesson.steps.filter(s => s.type !== 'intro').length;
    const currentGradedIdx = lesson.steps.slice(0, stepIdx + 1).filter(s => s.type !== 'intro').length;
    const isGradedStep = step.type !== 'intro';

    const handleCheck = () => {
        let correct = false;
        if (step.type === 'intro') {
            correct = true; // intros are always "correct", not graded
        } else if (step.type === 'select') {
            correct = selectedOption === step.correctAnswer;
            if (correct) setCorrectCount(c => c + 1);
        } else if (step.type === 'translate') {
            correct = wordBankSelection.join(' ') === step.targetSentence;
            if (correct) setCorrectCount(c => c + 1);
        }
        setIsCorrect(correct);
        setIsChecked(true);
    };

    const handleContinue = () => {
        if (stepIdx < lesson.steps.length - 1) {
            setStepIdx(s => s + 1);
            setSelectedOption(null);
            setWordBankSelection([]);
            setIsChecked(false);
            setIsCorrect(null);
        } else {
            setIsFinished(true);
        }
    };

    const toggleWord = (word: string) => {
        if (isChecked) return;
        if (wordBankSelection.includes(word)) {
            setWordBankSelection(prev => prev.filter(w => w !== word));
        } else {
            setWordBankSelection(prev => [...prev, word]);
        }
    };

    const canCheck =
        step.type === 'intro' ||
        (step.type === 'select' && selectedOption !== null) ||
        (step.type === 'translate' && wordBankSelection.length > 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
            {/* Header */}
            <div className="max-w-4xl mx-auto w-full px-4 py-6 flex items-center gap-4">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={32} />
                </button>
                <div className="flex-1 flex items-center gap-1.5">
                    {lesson.steps.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-3.5 rounded-full transition-all duration-500 ${i < stepIdx ? 'bg-green-500' : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
                {isGradedStep && !isFinished && (
                    <div className="flex items-center gap-1 text-slate-500 font-bold whitespace-nowrap">
                        <span>Question {currentGradedIdx} of {totalGraded}</span>
                    </div>
                )}
                {!isGradedStep && !isFinished && (
                    <div className="flex items-center gap-1 text-brand-yellow font-black">
                        <Star size={20} fill="currentColor" />
                        <span>Intro</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-2xl mx-auto h-full flex flex-col">
                    {!isFinished && <h2 className="text-3xl font-black mb-8">{step.title}</h2>}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={stepIdx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`flex-1 ${isFinished ? 'hidden' : ''}`}
                        >
                            {/* ── Intro slide ── */}
                            {step.type === 'intro' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 flex items-start gap-6">
                                        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white shrink-0">
                                            <BookOpen size={32} />
                                        </div>
                                        <div>
                                            <p className="text-xl text-slate-700 leading-relaxed font-medium">
                                                {step.content}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-brand-primary/10 p-6 rounded-2xl border-2 border-brand-primary/20">
                                        <p className="text-xs font-black text-brand-primary uppercase mb-2 tracking-widest">
                                            Usage Example
                                        </p>
                                        <p className="text-2xl font-bold text-slate-800 italic">"{step.explanation}"</p>
                                    </div>
                                </div>
                            )}

                            {/* ── Select slide ── */}
                            {step.type === 'select' && (
                                <div className="space-y-8">
                                    {step.content && (
                                        <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
                                            <p className="text-2xl font-bold text-slate-700">{step.content}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 gap-4">
                                        {step.options?.map((opt, i) => (
                                            <button
                                                key={opt}
                                                disabled={isChecked}
                                                onClick={() => setSelectedOption(i)}
                                                className={`
                        p-6 rounded-2xl border-2 text-left font-bold text-xl transition-all
                        ${selectedOption === i
                                                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
                        ${isChecked && i === step.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                        ${isChecked && selectedOption === i && i !== step.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                      `}
                                            >
                                                <span className="mr-4 text-slate-300">{i + 1}</span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Translate slide ── */}
                            {step.type === 'translate' && (
                                <div className="space-y-12">
                                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
                                        <p className="text-2xl font-bold text-slate-700">{step.content}</p>
                                    </div>

                                    {/* Answer area */}
                                    <div className="min-h-[80px] border-b-2 border-slate-200 flex flex-wrap gap-2 p-2">
                                        {wordBankSelection.map(word => (
                                            <button
                                                key={word}
                                                onClick={() => toggleWord(word)}
                                                className="bg-white border-2 border-b-4 border-slate-200 px-4 py-2 rounded-xl font-bold text-lg active:translate-y-1 active:border-b-2 transition-all"
                                            >
                                                {word}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Word bank */}
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {step.wordBank?.map(word => (
                                            <button
                                                key={word}
                                                disabled={wordBankSelection.includes(word) || isChecked}
                                                onClick={() => toggleWord(word)}
                                                className={`
                          px-4 py-2 rounded-xl font-bold text-lg border-2 border-b-4 transition-all
                          ${wordBankSelection.includes(word)
                                                        ? 'bg-slate-100 border-slate-100 text-transparent border-b-0'
                                                        : 'bg-white border-slate-200 hover:bg-slate-50 active:translate-y-1 active:border-b-2'}
                        `}
                                            >
                                                {word}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* ── Summary view ── */}
                    {isFinished && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12"
                        >
                            <div className="w-24 h-24 bg-brand-yellow rounded-3xl flex items-center justify-center text-white shadow-xl rotate-6 animate-bounce">
                                <Trophy size={48} fill="currentColor" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Lesson Complete!</h2>
                                <p className="text-xl text-slate-500 font-bold">You're leveling up your brain.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                                    <p className="text-3xl font-black text-brand-primary">{Math.round((correctCount / totalGraded) * 100)}%</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Stars Earned</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <Star size={24} className="text-brand-yellow" fill="currentColor" />
                                        <p className="text-3xl font-black text-slate-900">
                                            {initialCompleted ? '+0' : `+${correctCount}`}
                                        </p>
                                    </div>
                                    {initialCompleted && (
                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Already Earned</p>
                                    )}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onComplete(lessonId, correctCount, totalGraded)}
                                className="w-full max-w-sm bg-brand-primary text-white py-5 rounded-2xl font-black text-xl shadow-[0_6px_0_#46a302] active:translate-y-1 active:shadow-none transition-all"
                            >
                                RETURN HOME
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer */}
            {!isFinished && (
                <div className={`border-t-2 p-6 transition-colors ${!isChecked ? 'bg-white border-slate-100'
                    : isCorrect ? 'bg-green-100 border-green-200'
                        : 'bg-red-100 border-red-200'
                    }`}>
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        {isChecked && (
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {isCorrect ? <CheckCircle2 /> : <XCircle />}
                                </div>
                                <div>
                                    <p className={`font-black text-xl ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                        {isCorrect ? 'Excellent!' : 'Correct solution:'}
                                    </p>
                                    {!isCorrect && (
                                        <p className="text-red-700 font-bold">
                                            {step.type === 'select' && step.options && step.correctAnswer !== undefined
                                                ? step.options[step.correctAnswer]
                                                : step.targetSentence}
                                        </p>
                                    )}
                                    <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        {step.explanation}
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={isChecked ? handleContinue : handleCheck}
                            disabled={!isChecked && !canCheck}
                            className={`
              ml-auto px-12 py-4 rounded-2xl font-black text-xl transition-all
              ${!isChecked
                                    ? (!canCheck
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-brand-primary text-white shadow-[0_6px_0_#46a302]')
                                    : (isCorrect
                                        ? 'bg-green-500 text-white shadow-[0_6px_0_#3d8b02]'
                                        : 'bg-red-500 text-white shadow-[0_6px_0_#c40000]')}
              active:translate-y-1 active:shadow-none
            `}
                        >
                            {isChecked ? 'CONTINUE' : 'CHECK'}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default LessonSession;
