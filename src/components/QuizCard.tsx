import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Flame, DivideCircle } from 'lucide-react'; // Removed XCircle
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import { playSuccess, playError, playClick, playLifeline } from '../utils/sound';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface QuizCardProps {
    question: Question;
    questionIndex: number;
    selectedOption: string | null;
    onSelectOption: (questionIndex: number, option: string) => void;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isFirstQuestion: boolean;
    isLastQuestion: boolean;
    questionNumber: number;
    totalQuestions: number;
    streak: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
    question,
    questionIndex,
    selectedOption,
    onSelectOption,
    onPrevious,
    onNext,
    onSubmit,
    isFirstQuestion,
    isLastQuestion,
    questionNumber,
    totalQuestions,
    streak,
}) => {
    const [isShaking, setIsShaking] = React.useState(false);
    const [hiddenOptions, setHiddenOptions] = React.useState<string[]>([]);
    const [lifelineUsed, setLifelineUsed] = React.useState(false);

    // Reset local state when question changes
    React.useEffect(() => {
        setHiddenOptions([]);
        setLifelineUsed(false);
    }, [question.id]);

    const handleNext = () => {
        playClick();
        if (!selectedOption && !isLastQuestion) {
            setIsShaking(true);
            playError();
            setTimeout(() => setIsShaking(false), 500);
            return;
        }
        onNext();
    };

    const handleLifeline = () => {
        if (lifelineUsed || selectedOption) return;

        playLifeline();
        setLifelineUsed(true);
        const incorrect = question.options.filter(o => o !== question.correctAnswer);
        const shuffledIncorrect = incorrect.sort(() => 0.5 - Math.random());
        const toHide = shuffledIncorrect.slice(0, 2);
        setHiddenOptions(toHide);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 relative">
            {/* Background Glows */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow delay-700" />

            <div className="mb-8 flex justify-between items-end">
                <div>
                    <span className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1 block">Question {questionNumber} of {totalQuestions}</span>
                    <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                {streak > 1 && (
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 font-bold"
                    >
                        <Flame className="w-5 h-5 fill-current animate-pulse" />
                        <span>{streak} Streak!</span>
                    </motion.div>
                )}
            </div>

            {/* Lifelines Toolbar */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleLifeline}
                    disabled={lifelineUsed || !!selectedOption}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove 2 wrong answers"
                >
                    <div className="p-1 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                        <DivideCircle size={14} />
                    </div>
                    50/50
                </button>
            </div>

            <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group-card hover:border-white/20 transition-colors duration-500"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="mb-10 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-display font-medium text-white leading-relaxed tracking-tight">
                        {question.question}
                    </h2>
                </div>

                <div className="space-y-4 relative z-10">
                    {question.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isHidden = hiddenOptions.includes(option);
                        const isCorrect = option === question.correctAnswer;

                        if (isHidden) return null;

                        return (
                            <motion.button
                                key={option}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => {
                                    if (selectedOption) return;

                                    if (isCorrect) {
                                        playSuccess();
                                        confetti({
                                            particleCount: 50,
                                            spread: 60,
                                            origin: { y: 0.7 },
                                            colors: ['#22c55e', '#4ade80']
                                        });
                                    } else {
                                        playError();
                                    }
                                    onSelectOption(questionIndex, option);
                                }}
                                disabled={!!selectedOption}
                                whileHover={!selectedOption ? { scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" } : {}}
                                whileTap={!selectedOption ? { scale: 0.99 } : {}}
                                className={twMerge(
                                    "w-full p-5 text-left rounded-2xl border transition-all duration-300 flex items-center gap-5 group/option relative overflow-hidden",
                                    isSelected && isCorrect
                                        ? "border-green-500/50 bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                                        : isSelected && !isCorrect
                                            ? "border-red-500/50 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                                            : selectedOption
                                                ? "border-white/5 bg-white/5 opacity-50"
                                                : "border-white/10 bg-white/5 hover:border-white/20"
                                )}
                            >
                                <span className={twMerge(
                                    "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-sm font-display font-bold transition-all duration-300",
                                    isSelected && isCorrect ? "bg-green-500 text-white scale-110"
                                        : isSelected && !isCorrect ? "bg-red-500 text-white scale-110"
                                            : "bg-white/10 text-slate-300 group-hover/option:bg-white/20 group-hover/option:scale-110 group-hover/option:text-white"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className={twMerge(
                                    "flex-1 text-lg font-medium transition-colors",
                                    isSelected && isCorrect ? "text-green-100"
                                        : isSelected && !isCorrect ? "text-red-100"
                                            : "text-slate-300 group-hover/option:text-white"
                                )}>
                                    {option}
                                </span>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className={isCorrect ? "text-green-400" : "text-red-400"}
                                    >
                                        {isCorrect ? <CheckCircle className="w-7 h-7 fill-current" /> : <div className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-bold">✕</div>}
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            <div className="mt-10 flex justify-between gap-4 items-center">
                <button
                    onClick={onPrevious}
                    disabled={isFirstQuestion}
                    className="px-6 py-3 text-slate-500 font-medium hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-2 hover:-translate-x-1 duration-200"
                >
                    <ChevronLeft size={20} />
                    <span>Previous</span>
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={onSubmit}
                        className="px-10 py-4 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        <span>Finish Quiz</span>
                        <CheckCircle size={20} />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className={twMerge(
                            "px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 hover:bg-slate-100",
                            isShaking && "animate-shake bg-red-500 text-white hover:bg-red-600"
                        )}
                    >
                        <span>Next Question</span>
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};
