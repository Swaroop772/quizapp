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
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
    score,
    totalQuestions,
    onRestart,
    userName,
    questions = [],
    userAnswers = {},
    userRank,
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
                <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full" />
                <div className="relative z-10 mx-auto drop-shadow-2xl bg-white p-4 rounded-full border-4 border-orange-500">
                    <Trophy className="w-24 h-24 text-orange-500 fill-orange-100" />
                </div>
                {percentage === 100 && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-4 -right-4 text-yellow-400"
                        >
                            <Star className="w-12 h-12 fill-current drop-shadow-lg" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-2 -left-4 text-yellow-500"
                        >
                            <Sparkles className="w-10 h-10 fill-current drop-shadow-lg" />
                        </motion.div>
                    </>
                )}
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-ninja font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-600 mb-4 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] stroke-black"
                style={{ WebkitTextStroke: '1px white' }}
            >
                {userName ? `${userName}, ` : ''}{message}
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-700 font-bold mb-2 text-xl font-mono bg-white/40 inline-block px-4 py-1 rounded-lg backdrop-blur-sm"
            >
                Mission Rank: {score} / {totalQuestions}
            </motion.p>

            {userRank && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 backdrop-blur-md px-6 py-3 rounded-full border border-yellow-500/20"
                >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-display font-bold text-yellow-200">
                        Rank #{userRank}
                    </span>
                    <span className="text-sm text-yellow-400/60">on leaderboard</span>
                </motion.div>
            )}

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-[#fdfbf7] rounded-xl p-8 mb-8 border-4 border-[#f4e4bc] shadow-xl relative overflow-hidden"
            >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none" />

                <div className="flex justify-between items-end mb-2 relative z-10">
                    <span className="text-slate-600 font-bold font-ninja uppercase tracking-widest text-lg">Chakra Control (Accuracy)</span>
                    <span className="text-4xl font-ninja font-bold text-orange-600 drop-shadow-sm">{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden border-2 border-slate-300 relative z-10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full shadow-inner flex items-center justify-end pr-2"
                    >
                        {/* Inner shine */}
                        <div className="w-full h-1/2 bg-white/30 absolute top-0 left-0" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Detailed Breakdown */}
            {/* Detailed Breakdown */}
            {questions.length > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#fdfbf7] rounded-xl p-0 mb-8 border-4 border-[#f4e4bc] shadow-xl text-left relative overflow-hidden"
                >
                    {/* Scroll Rollers */}
                    <div className="h-4 bg-[#8b5a2b] shadow-md relative z-20 border-b border-[#6d4521]" />

                    {/* Paper Texture */}
                    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none" />

                    <div className="p-6 relative z-10">
                        <h3 className="text-2xl font-ninja font-bold text-slate-800 mb-6 border-b-2 border-dashed border-slate-300 pb-2 text-center text-orange-700">Mission Report</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {questions.map((q, index) => {
                                const userAnswer = userAnswers[index];
                                const isCorrect = userAnswer === q.correctAnswer;

                                return (
                                    <div key={q.id} className={`p-4 rounded-lg border-2 transition-colors ${isCorrect ? 'border-green-400 bg-green-50/80 hover:bg-green-100' : 'border-red-400 bg-red-50/80 hover:bg-red-100'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 p-1 rounded-full ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900 mb-1 font-body text-lg">
                                                    <span className="font-ninja text-slate-500 text-sm mr-2">JUTSU #{index + 1}</span>
                                                    {q.question}
                                                </p>
                                                <p className="text-sm text-slate-700 font-medium bg-white/50 p-2 rounded inline-block mb-2">
                                                    <span className="font-bold opacity-70">Your seal:</span> {userAnswer || 'No answer'}
                                                </p>
                                                {!isCorrect && (
                                                    <div className="text-sm text-green-700 font-bold bg-green-100/50 p-2 rounded mb-2 border border-green-200">
                                                        <span>Correct seal:</span> {q.correctAnswer}
                                                    </div>
                                                )}
                                                <p className="text-sm text-slate-600 mt-2 italic border-t border-slate-200/50 pt-2">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="h-4 bg-[#8b5a2b] shadow-md relative z-20 border-t border-[#6d4521]" />
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
                    className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-ninja font-bold rounded-xl transition-all shadow-lg border-2 border-orange-800 flex items-center justify-center gap-2 w-full md:w-auto uppercase tracking-wide"
                >
                    <RefreshCw size={20} />
                    Retry Mission
                </motion.button>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={() => window.location.reload()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-[#fdfbf7] text-slate-700 border-2 border-[#d4c5a3] font-ninja font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 w-full md:w-auto hover:bg-white hover:border-orange-300 uppercase tracking-wide"
                >
                    Return to Village
                </motion.button>
            </div>
        </div>
    );
};
