import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, X } from 'lucide-react';

interface LeaderboardEntry {
    name: string;
    score: number;
    totalQuestions: number;
    timeUsed: number;
    date: string;
}

interface LeaderboardProps {
    isOpen: boolean;
    onClose: () => void;
    currentScore?: {
        name: string;
        score: number;
        totalQuestions: number;
        timeUsed: number;
    };
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose, currentScore }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

    const API_URL = 'http://localhost:3001/api/scores';

    useEffect(() => {
        if (isOpen) {
            fetch(`${API_URL}?limit=10`)
                .then(res => res.json())
                .then(data => setEntries(data))
                .catch(err => console.error('Failed to load leaderboard', err));
        }
    }, [isOpen]);

    useEffect(() => {
        if (currentScore && isOpen) {
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentScore)
            })
                .then(res => res.json())
                .then(newEntry => {
                    setEntries(prev => {
                        const updated = [...prev, newEntry]
                            .sort((a, b) => b.percentage - a.percentage || a.timeUsed - b.timeUsed)
                            .slice(0, 10);
                        return updated;
                    });
                    // Refresh list to be sure
                    return fetch(`${API_URL}?limit=10`);
                })
                .then(res => res.json())
                .then(data => setEntries(data))
                .catch(err => console.error('Failed to save score', err));
        }
    }, [currentScore, isOpen]);

    if (!isOpen) return null;

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-slate-500">#{index + 1}</span>;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Leaderboard
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {entries.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                No scores yet. Be the first!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {entries.map((entry, index) => {
                                    const percentage = Math.round((entry.score / entry.totalQuestions) * 100);
                                    const isCurrentScore = currentScore &&
                                        entry.name === currentScore.name &&
                                        entry.score === currentScore.score &&
                                        Math.abs(new Date(entry.date).getTime() - Date.now()) < 5000;

                                    return (
                                        <motion.div
                                            key={`${entry.name}-${entry.date}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-4 rounded-lg border-2 transition-all ${isCurrentScore
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30'
                                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {getRankIcon(index)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                                                        {entry.name}
                                                        {isCurrentScore && (
                                                            <span className="ml-2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">
                                                                You!
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                        <span>{entry.score}/{entry.totalQuestions} ({percentage}%)</span>
                                                        <span>•</span>
                                                        <span>{Math.floor(entry.timeUsed / 60)}:{String(entry.timeUsed % 60).padStart(2, '0')}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-brand-600">
                                                        {percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
