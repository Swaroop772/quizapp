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
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="mb-6 flex justify-between items-center text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                <span>Question {questionNumber} of {totalQuestions}</span>
                {streak > 1 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-orange-500 font-bold"
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
                    title="Remove 2 wrong answers"
                >
                    <DivideCircle size={14} />
                    50/50
                </button>
            </div>

            <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -100, rotate: 10 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-100 to-transparent dark:from-brand-900/20 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-700" />

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 relative z-10 leading-snug">
                    {question.question}
                </h2>

                <div className="space-y-4 relative z-10">
                    {question.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isHidden = hiddenOptions.includes(option);
                        const isCorrect = option === question.correctAnswer;


                        if (isHidden) return null; // Hide option if 50/50 used

                        return (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => {
                                    if (selectedOption) return;

                                    if (isCorrect) {
                                        playSuccess();
                                        confetti({
                                            particleCount: 30,
                                            spread: 50,
                                            origin: { y: 0.6 },
                                            colors: ['#22c55e', '#16a34a']
                                        });
                                    } else {
                                        playError();
                                    }
                                    onSelectOption(questionIndex, option);
                                }}
                                disabled={!!selectedOption}
                                whileHover={!selectedOption ? { scale: 1.01 } : {}}
                                whileTap={!selectedOption ? { scale: 0.99 } : {}}
                                className={twMerge(
                                    "w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group/option relative overflow-hidden",
                                    isSelected && isCorrect
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md shadow-green-200 dark:shadow-green-900/20"
                                        : isSelected && !isCorrect
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md shadow-red-200 dark:shadow-red-900/20"
                                            : selectedOption
                                                ? "border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
                                                : "border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                                )}
                            >
                                <span className={twMerge(
                                    "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors",
                                    isSelected && isCorrect ? "bg-green-500 text-white"
                                        : isSelected && !isCorrect ? "bg-red-500 text-white"
                                            : "bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover/option:bg-brand-200 dark:group-hover/option:bg-slate-600"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className={twMerge(
                                    "flex-1 font-medium transition-colors",
                                    isSelected && isCorrect ? "text-green-900 dark:text-green-100"
                                        : isSelected && !isCorrect ? "text-red-900 dark:text-red-100"
                                            : "text-slate-700 dark:text-slate-300"
                                )}>
                                    {option}
                                </span>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={isCorrect ? "text-green-500" : "text-red-500"}
                                    >
                                        {isCorrect ? <CheckCircle className="w-6 h-6 fill-current" /> : <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-bold">✕</div>}
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            <div className="mt-8 flex justify-between gap-4">
                <button
                    onClick={onPrevious}
                    disabled={isFirstQuestion}
                    className="px-6 py-3 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-2 hover:-translate-x-1 duration-200"
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={onSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Review Answers
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className={twMerge(
                            "px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2",
                            isShaking && "animate-shake bg-red-500 dark:bg-red-500 text-white"
                        )}
                    >
                        Next Question
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};
