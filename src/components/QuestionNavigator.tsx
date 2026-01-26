import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Dot } from 'lucide-react';
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
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Question Navigator
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
                                "aspect-square rounded-lg font-semibold text-sm transition-all flex items-center justify-center relative",
                                isCurrent && "ring-2 ring-brand-500 ring-offset-2",
                                isAnswered && !isCurrent && "bg-green-100 text-green-700 border border-green-300",
                                !isAnswered && !isCurrent && "bg-slate-100 text-slate-400 border border-slate-300 hover:bg-slate-200",
                                isCurrent && isAnswered && "bg-brand-500 text-white",
                                isCurrent && !isAnswered && "bg-orange-100 text-orange-700 border-2 border-orange-500"
                            )}
                        >
                            {i + 1}
                            {isAnswered && !isCurrent && (
                                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
                            )}
                            {isCurrent && (
                                <Dot className="absolute -top-1 -right-1 w-5 h-5 text-orange-600 bg-white rounded-full animate-pulse" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                    <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-slate-100 border border-slate-300"></div>
                    <span>Pending</span>
                </div>
            </div>
        </div>
    );
};
