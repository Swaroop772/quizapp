import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { api } from '../services/api';
import type { ScoreData } from '../services/api';

interface LeaderboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
    const [entries, setEntries] = useState<ScoreData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState<string>('');
    const [chapters, setChapters] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        // Load chapters dynamically
        import('../data/questions.json').then(mod => {
            setChapters([
                { id: '', title: 'All Categories' },
                { id: 'overall', title: 'Full Quiz Mode' },
                ...mod.default.chapters.map(c => ({ id: c.id, title: c.title }))
            ]);
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.getLeaderboard(10, selectedChapterId)
                .then(data => setEntries(data))
                .catch(err => console.error('Failed to load leaderboard', err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, selectedChapterId]);


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
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
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

                        <select
                            value={selectedChapterId}
                            onChange={(e) => setSelectedChapterId(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            {chapters.map(chapter => (
                                <option key={chapter.id} value={chapter.id}>
                                    {chapter.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                            </div>
                        ) : entries.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                                No scores yet. Be the first!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {entries.map((entry, index) => {
                                    // Calculate percentage if not provided by backend
                                    const percentage = entry.percentage || Math.round((entry.score / entry.totalQuestions) * 100);

                                    return (
                                        <motion.div
                                            key={`${entry.name}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 rounded-lg border-2 transition-all border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    {getRankIcon(index)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                                                        {entry.name}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                        <span>{entry.score}/{entry.totalQuestions} ({percentage}%)</span>
                                                        <span>•</span>
                                                        <span>{Math.floor(entry.timeUsed / 60)}:{String(entry.timeUsed % 60).padStart(2, '0')}</span>
                                                        <span>•</span>
                                                        <span>{new Date(entry.createdAt || Date.now()).toLocaleDateString()}</span>
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
