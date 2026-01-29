import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentQuestion: number;
    answeredQuestions: Set<number>;
    onNavigate: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
    totalQuestions,
    currentQuestion,
    answeredQuestions,
    onNavigate,
}) => {
    return (
        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display flex items-center gap-2">
                <span className="w-1 h-4 bg-brand-500 rounded-full" />
                Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }, (_, i) => {
                    const isAnswered = answeredQuestions.has(i);
                    const isCurrent = i === currentQuestion;

                    return (
                        <motion.button
                            key={i}
                            onClick={() => onNavigate(i)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={twMerge(
                                "aspect-square rounded-xl font-bold text-sm transition-all flex items-center justify-center relative border",
                                isCurrent && "ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-900 border-transparent",
                                isAnswered && !isCurrent && "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
                                !isAnswered && !isCurrent && "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20",
                                isCurrent && isAnswered && "bg-green-500 text-white border-green-500",
                                isCurrent && !isAnswered && "bg-brand-500 text-white border-brand-500"
                            )}
                        >
                            {i + 1}
                            {isAnswered && !isCurrent && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            )}
                            {isCurrent && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <span>Done</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10 border border-white/20"></div>
                    <span>Left</span>
                </div>
            </div>
        </div>
    );
};
