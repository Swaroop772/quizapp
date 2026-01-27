import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Star, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface ResultScreenProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
    userName?: string;
    questions?: Question[];
    userAnswers?: Record<number, string>;
    userRank?: number | null;
    onShowLeaderboard?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
    score,
    totalQuestions,
    onRestart,
    userName,
    questions = [],
    userAnswers = {},
    userRank,
    onShowLeaderboard
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);

    let message = "";
    if (percentage >= 100) message = "Perfect Score! 🎉";
    else if (percentage >= 80) message = "Expert Status!";
    else if (percentage >= 60) message = "Solid Knowledge!";
    else message = "Keep Studying!";

    // Confetti effect for perfect score
    useEffect(() => {
        if (percentage === 100) {
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [percentage]);

    return (
        <div className="text-center w-full max-w-4xl mx-auto p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-8 relative inline-block"
            >
                <div className="absolute inset-0 bg-accent-400/20 blur-3xl rounded-full" />
                <Trophy className="w-32 h-32 text-accent-600 relative z-10 mx-auto drop-shadow-2xl" />
                {percentage === 100 && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-4 -right-4 text-amber-400"
                        >
                            <Star className="w-12 h-12 fill-current" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-2 -left-4 text-amber-400"
                        >
                            <Sparkles className="w-10 h-10 fill-current" />
                        </motion.div>
                    </>
                )}
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 mb-2"
            >
                {userName ? `${userName}, ` : ''}{message}
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 dark:text-slate-400 mb-2 text-lg"
            >
                You scored {score} out of {totalQuestions}
            </motion.p>

            {userRank && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 dark:from-yellow-400/20 dark:to-amber-400/20 px-6 py-3 rounded-full border-2 border-yellow-500/30 dark:border-yellow-400/30"
                >
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                        Rank #{userRank}
                    </span>
                    <span className="text-sm text-yellow-600/80 dark:text-yellow-400/80">on leaderboard</span>
                </motion.div>
            )}

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg"
            >
                <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Accuracy</span>
                    <span className="text-3xl font-bold text-brand-600">{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full"
                    />
                </div>
            </motion.div>

            {/* Detailed Breakdown */}
            {questions.length > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg text-left"
                >
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Detailed Breakdown</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {questions.map((q, index) => {
                            const userAnswer = userAnswers[index];
                            const isCorrect = userAnswer === q.correctAnswer;

                            return (
                                <div key={q.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                                    <div className="flex items-start gap-3">
                                        {isCorrect ? (
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-white mb-1">Q{index + 1}: {q.question}</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                <span className="font-medium">Your answer:</span> {userAnswer || 'No answer'}
                                            </p>
                                            {!isCorrect && (
                                                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                                    <span className="font-medium">Correct answer:</span> {q.correctAnswer}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">{q.explanation}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={onRestart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-slate-700 dark:to-slate-600 text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <RefreshCw size={20} />
                    Restart Quiz
                </motion.button>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={onShowLeaderboard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 border-2 border-brand-200 dark:border-brand-900 font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <Trophy size={20} />
                    View Leaderboard
                </motion.button>
            </div>
        </div>
    );
};
