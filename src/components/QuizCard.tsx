import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Flame, DivideCircle, Sword } from 'lucide-react';
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

    // Mock HP for the "Enemy Question"
    const [enemyHp, setEnemyHp] = React.useState(100);

    // Reset local state when question changes
    React.useEffect(() => {
        setHiddenOptions([]);
        setLifelineUsed(false);
        setEnemyHp(100);
    }, [question.id]);

    const handleOptionClick = (option: string, index: number) => {
        if (selectedOption) return;

        const isCorrect = option === question.correctAnswer;

        if (isCorrect) {
            setEnemyHp(0); // Instantly kill the question
            playSuccess();
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#f97316', '#fbbf24', '#ffffff'],
                shapes: ['star']
            });
        } else {
            playError();
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }

        onSelectOption(questionIndex, option);
    };

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
        <div className="w-full max-w-3xl mx-auto p-4 relative perspective-1000">
            {/* Enemy HUD (Boss Bar) */}
            <div className="mb-6 relative z-30">
                <div className="flex justify-between text-brand-200 text-xs font-bold uppercase tracking-widest mb-1 shadow-black drop-shadow-md">
                    <span>Target: {question.id}</span>
                    <span>HP {enemyHp}/100</span>
                </div>
                <div className="h-4 bg-black/60 rounded-full border-2 border-slate-600 overflow-hidden relative shadow-lg">
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${enemyHp}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    </motion.div>
                </div>
            </div>

            <motion.div
                key={question.id}
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full relative shadow-2xl group-card "
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Scroll Top Roll */}
                <div className="h-8 bg-[#d4c5a9] rounded-full mx-auto w-[104%] relative z-20 shadow-xl border border-[#b0a080] flex items-center justify-center">
                    <div className="w-1/2 h-1 bg-[#b0a080]/30 rounded-full" />
                </div>

                {/* Main Scroll Content */}
                <div className="bg-[#fdf6e3] relative z-10 px-8 py-10 min-h-[350px] mx-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-x-[6px] border-[#e6d8b8]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />

                    {/* "Wanted" Poster Style Header */}
                    <div className="text-center mb-8 border-b-2 border-dashed border-slate-400/30 pb-4">
                        <span className="text-red-600 font-extrabold text-xs tracking-[0.5em] uppercase block mb-1 font-ninja">Mission Objective</span>
                        <h2 className="text-2xl md:text-3xl font-display font-black text-slate-800 leading-tight">
                            {question.question}
                        </h2>
                    </div>

                    <div className="space-y-4 relative z-20">
                        {question.options.map((option, index) => {
                            const isSelected = selectedOption === option;
                            const isHidden = hiddenOptions.includes(option);
                            const isCorrect = option === question.correctAnswer;

                            if (isHidden) return null;

                            return (
                                <motion.button
                                    key={option}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleOptionClick(option, index)}
                                    disabled={!!selectedOption}
                                    whileHover={!selectedOption ? { scale: 1.05, x: 20, backgroundColor: "#fff" } : {}}
                                    whileTap={!selectedOption ? { scale: 0.95 } : {}}
                                    className={twMerge(
                                        "w-full p-4 text-left rounded-r-xl border-l-4 transition-all duration-200 flex items-center gap-4 relative overflow-hidden font-display font-bold text-lg shadow-sm group/btn",
                                        isSelected && isCorrect
                                            ? "border-l-green-500 bg-green-100 text-green-900 translate-x-4"
                                            : isSelected && !isCorrect
                                                ? "border-l-red-500 bg-red-100 text-red-900 animate-shake"
                                                : selectedOption
                                                    ? "border-l-slate-300 bg-slate-100/50 text-slate-400"
                                                    : "border-l-brand-500 bg-white/60 hover:shadow-md text-slate-700"
                                    )}
                                >
                                    {/* Hover visual arrow */}
                                    <div className="absolute left-0 top-0 bottom-0 w-0 bg-brand-500/10 group-hover/btn:w-full transition-all duration-300 -z-10" />

                                    <div className={twMerge(
                                        "w-8 h-8 flex items-center justify-center transition-transform duration-300",
                                        isSelected ? "scale-125" : "group-hover/btn:rotate-90"
                                    )}>
                                        {isSelected && isCorrect ? (
                                            <Sword className="w-6 h-6 text-green-600 animate-bounce" />
                                        ) : isSelected && !isCorrect ? (
                                            <div className="text-red-600 font-black text-2xl">X</div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center text-xs text-slate-500 group-hover/btn:border-brand-500 group-hover/btn:text-brand-500">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                        )}
                                    </div>

                                    <span className="flex-1 leading-snug">
                                        {option}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Scroll Bottom Roll */}
                <div className="h-8 bg-[#d4c5a9] rounded-full mx-auto w-[104%] relative z-0 shadow-2xl border border-[#b0a080] flex items-center justify-center mt-[-10px]">
                    <div className="w-1/2 h-1 bg-[#b0a080]/30 rounded-full" />
                </div>
            </motion.div>

            {/* Battle Controls / Footer */}
            <div className="mt-8 flex justify-between gap-4 items-center">
                <button
                    onClick={handleLifeline}
                    disabled={lifelineUsed || !!selectedOption}
                    className="flex flex-col items-center gap-1 group disabled:opacity-50"
                >
                    <div className="w-12 h-12 rounded-full border-2 border-brand-500 bg-black/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <DivideCircle className="text-brand-400" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-200 uppercase tracking-widest">Jutsu</span>
                </button>

                {(isLastQuestion || selectedOption) ? (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={isLastQuestion ? onSubmit : handleNext}
                        className={twMerge(
                            "px-10 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black font-display tracking-widest rounded-full shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:scale-110 active:scale-95 flex items-center gap-3 border-2 border-white/20 uppercase text-lg group relative overflow-hidden"
                        )}
                    >
                        <span>{isLastQuestion ? "FINISH EXAM" : "NEXT BATTLE"}</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                ) : (
                    <div className="text-center">
                        <div className="text-white/30 text-xs font-mono mb-1">CURRENT STREAK</div>
                        <div className="text-xl font-black text-brand-400 font-display">{streak}</div>
                    </div>
                )}

                <button onClick={onPrevious} disabled={isFirstQuestion} className="flex flex-col items-center gap-1 group disabled:opacity-30">
                    <div className="w-10 h-10 rounded-full border border-slate-600 bg-black/40 flex items-center justify-center group-hover:border-white transition-colors">
                        <ChevronLeft className="text-slate-400 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Retreat</span>
                </button>
            </div>
        </div>
    );
};
