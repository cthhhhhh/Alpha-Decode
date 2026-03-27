import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, Coins, Trophy, Flag, RotateCcw } from 'lucide-react';
import FlagModal from './FlagModal';

function fisherYates<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function shuffleSteps(steps: Step[]): Step[] {
    if (steps.length === 0) return steps;
    const intro = steps.filter(s => s.question_type === 'INTRO');
    const rest = steps.filter(s => s.question_type !== 'INTRO');
    fisherYates(rest);
    return [...intro, ...rest].map(step => {
        if (step.question_type === 'SELECT' && step.options) {
            const paired = step.options.map((opt, i) => ({ opt, isCorrect: i === step.correctAnswer }));
            fisherYates(paired);
            return {
                ...step,
                options: paired.map(p => p.opt),
                correctAnswer: paired.findIndex(p => p.isCorrect),
            };
        }
        if (step.question_type === 'TRANSLATE' && step.wordbank) {
            const wb = [...step.wordbank];
            fisherYates(wb);
            return { ...step, wordbank: wb };
        }
        return step;
    });
}

interface Step {
    id?: number;
    question_type: 'INTRO' | 'SELECT' | 'TRANSLATE';
    title: string;
    content?: string;
    explanation: string;
    options?: string[];
    correctAnswer?: number;
    wordbank?: string[];
    target?: string;
}

interface LessonData {
    id: number;
    title: string;
    quiz?: {
        questions: Step[];
    };
}

interface Props {
    lessonId: string;
    initialCompleted: boolean;
    onClose: () => void;
    onComplete: (id: string, correct: number, total: number) => void;
    practiceMode?: boolean;
}

const LessonSession = ({ lessonId, initialCompleted, onClose, onComplete, practiceMode = false }: Props) => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [loading, setLoading] = useState(true);

    const [stepIdx, setStepIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [wordBankSelection, setWordBankSelection] = useState<string[]>([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showFlag, setShowFlag] = useState(false);
    const [lessonTitle, setLessonTitle] = useState('');

    useEffect(() => {
        let isMounted = true;
        fetch(`/api/lessons/questions/${lessonId}`)
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data: LessonData) => {
                if (isMounted) {
                    setLessonTitle(data.title);
                    setSteps(shuffleSteps(data.quiz?.questions ?? []));
                    setLoading(false);
                }
            })
            .catch(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, [lessonId]);

    if (loading) return (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
            <div className="text-2xl font-black text-slate-400 animate-pulse">Loading...</div>
        </div>
    );

    if (steps.length === 0) return null;

    const step = steps[stepIdx];
    const totalGraded = steps.filter(s => s.question_type !== 'INTRO').length;
    const currentGradedIdx = steps.slice(0, stepIdx + 1).filter(s => s.question_type !== 'INTRO').length;
    const isGradedStep = step.question_type !== 'INTRO';

    const handleCheck = () => {
        let correct = false;
        if (step.question_type === 'INTRO') {
            correct = true;
        } else if (step.question_type === 'SELECT') {
            correct = selectedOption === step.correctAnswer;
            if (correct) setCorrectCount(c => c + 1);
        } else if (step.question_type === 'TRANSLATE') {
            correct = wordBankSelection.join(' ') === step.target;
            if (correct) setCorrectCount(c => c + 1);
        }
        setIsCorrect(correct);
        setIsChecked(true);
    };

    const handleContinue = () => {
        if (stepIdx < steps.length - 1) {
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
        step.question_type === 'INTRO' ||
        (step.question_type === 'SELECT' && selectedOption !== null) ||
        (step.question_type === 'TRANSLATE' && wordBankSelection.length > 0);

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
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-3.5 rounded-full transition-all duration-500 ${i < stepIdx ? 'bg-green-500' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>
                {practiceMode && !isFinished && (
                    <div className="flex items-center gap-1.5 bg-brand-accent/10 text-brand-accent px-3 py-1.5 rounded-full border border-brand-accent/30 shrink-0">
                        <RotateCcw size={13} />
                        <span className="text-[10px] font-black uppercase tracking-wide">Practice</span>
                    </div>
                )}
                {isGradedStep && !isFinished && (
                    <div className="flex items-center gap-2 text-slate-500 font-bold whitespace-nowrap">
                        <span>Question {currentGradedIdx} of {totalGraded}</span>
                        {step.id && (
                            <button
                                onClick={() => setShowFlag(true)}
                                className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all group"
                                title="Flag this question"
                            >
                                <Flag size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>
                )}
                {!isGradedStep && !isFinished && (
                    <div className="flex items-center gap-1 text-brand-yellow font-black">
                        <Coins size={20} />
                        <span>Intro</span>
                    </div>
                )}
            </div>

            <FlagModal
                show={showFlag}
                contentType="QUESTION"
                contentId={step.id ?? 0}
                context={`${lessonTitle ? `Lesson: ${lessonTitle}` : `Lesson ID: ${lessonId}`} - "${step.title}"${step.question_type === 'TRANSLATE' && step.target ? `: ${step.target}` : step.question_type === 'SELECT' && step.content ? `: ${step.content}` : ''}`}
                onClose={() => setShowFlag(false)}
            />

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
                            {/* Intro */}
                            {step.question_type === 'INTRO' && (
                                <div className="space-y-8">
                                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 flex items-start gap-6">
                                        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white shrink-0">
                                            <BookOpen size={32} />
                                        </div>
                                        <div>
                                            <p className="text-xl text-slate-700 leading-relaxed font-medium">{step.content}</p>
                                        </div>
                                    </div>
                                    <div className="bg-brand-primary/10 p-6 rounded-2xl border-2 border-brand-primary/20">
                                        <p className="text-xs font-black text-brand-primary uppercase mb-2 tracking-widest">Usage Example</p>
                                        <p className="text-2xl font-bold text-slate-800 italic">{step.explanation}</p>
                                    </div>
                                </div>
                            )}

                            {/* Select */}
                            {step.question_type === 'SELECT' && (
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
                          ${selectedOption === i ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
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

                            {/* Translate */}
                            {step.question_type === 'TRANSLATE' && (
                                <div className="space-y-12">
                                    <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
                                        <p className="text-2xl font-bold text-slate-700">{step.content}</p>
                                    </div>
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
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {step.wordbank?.map(word => (
                                            <button
                                                key={word}
                                                disabled={wordBankSelection.includes(word) || isChecked}
                                                onClick={() => toggleWord(word)}
                                                className={`
                          px-4 py-2 rounded-xl font-bold text-lg border-2 border-b-4 transition-all
                          ${wordBankSelection.includes(word) ? 'bg-slate-100 border-slate-100 text-transparent border-b-0' : 'bg-white border-slate-200 hover:bg-slate-50 active:translate-y-1 active:border-b-2'}
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

                    {/* Summary */}
                    {isFinished && (() => {
                        const accuracy = totalGraded === 0 ? 100 : Math.round((correctCount / totalGraded) * 100);
                        let title = "Lesson Complete!";
                        let subtitle = "You're leveling up your brain.";
                        
                        if (accuracy === 100) {
                            title = "Sigma Performance!";
                            subtitle = "Maximum Rizz! +5 Coins earned.";
                        } else if (accuracy >= 80) {
                            title = "So Close!";
                            subtitle = "Almost a Sigma! Try again for stars.";
                        } else if (accuracy >= 60) {
                            title = "Delulu Moment?";
                            subtitle = "The delulu is not the solulu. No stars awarded.";
                        } else {
                            title = "Total Ohio...";
                            subtitle = "Go back to Skibidi 101. Try again!";
                        }

                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12"
                            >
                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-6 ${accuracy === 100 ? 'bg-brand-yellow animate-bounce' : 'bg-slate-300'}`}>
                                    <Trophy size={48} fill="currentColor" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
                                    <p className="text-xl text-brand-primary font-bold">{subtitle}</p>
                                </div>
                                <div className={`grid gap-4 w-full max-w-sm ${practiceMode ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                                        <p className="text-3xl font-black text-brand-primary">{accuracy}%</p>
                                    </div>
                                    {practiceMode ? (
                                        <div className="bg-brand-accent/10 p-6 rounded-3xl border-2 border-brand-accent/20 text-center">
                                            <RotateCcw size={24} className="text-brand-accent mx-auto mb-2" />
                                            <p className="text-sm font-black text-brand-accent uppercase tracking-widest mb-1">Practice Complete</p>
                                            <p className="text-[10px] font-bold text-slate-500">No XP awarded in practice mode</p>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Coins Earned</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <Coins size={24} className={accuracy === 100 ? "text-brand-yellow" : "text-slate-300"} />
                                                <p className="text-3xl font-black text-slate-900">
                                                    {initialCompleted || accuracy < 100 ? '+0' : '+5'}
                                                </p>
                                            </div>
                                            {(initialCompleted || (accuracy < 100 && !initialCompleted)) && (
                                                <p className="text-[10px] font-black text-slate-400 uppercase mt-1">
                                                    {initialCompleted ? 'Already Earned' : '100% Required'}
                                                </p>
                                            )}
                                        </div>
                                    )}
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
                        );
                    })()}
                </div>
            </div>

            {/* Footer */}
            {!isFinished && (
                <div className={`border-t-2 p-6 transition-colors ${!isChecked ? 'bg-white border-slate-100' : isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
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
                                            {step.question_type === 'SELECT' && step.options && step.correctAnswer !== undefined
                                                ? step.options[step.correctAnswer]
                                                : step.target}
                                        </p>
                                    )}
                                    <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{step.explanation}</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={isChecked ? handleContinue : handleCheck}
                            disabled={!isChecked && !canCheck}
                            className={`
              ml-auto px-12 py-4 rounded-2xl font-black text-xl transition-all
              ${!isChecked
                                ? (!canCheck ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-brand-primary text-white shadow-[0_6px_0_#46a302]')
                                : (isCorrect ? 'bg-green-500 text-white shadow-[0_6px_0_#3d8b02]' : 'bg-red-500 text-white shadow-[0_6px_0_#c40000]')}
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
