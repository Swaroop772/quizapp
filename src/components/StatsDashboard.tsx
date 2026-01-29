import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Zap, TrendingUp, ChevronLeft, Award, Activity, BarChart3, Calendar } from 'lucide-react';
import { storage, type QuizResult } from '../services/storage';

interface StatsDashboardProps {
    onBack?: () => void;
    currentSessionStats?: {
        answeredCount: number;
        timeElapsed: number;
        currentStreak: number;
        longestStreak: number;
    };
    mode?: 'mini' | 'full';
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
    onBack,
    currentSessionStats,
    mode = 'full'
}) => {
    const [history, setHistory] = useState<QuizResult[]>([]);
    const [aggregate, setAggregate] = useState<any>(null);

    useEffect(() => {
        const hist = storage.getHistory();
        setHistory(hist);
        const agg = storage.getAggregateStats();
        setAggregate(agg);
    }, []);

    // Helper for Radar Chart calculations
    const calculateRadarPoints = () => {
        if (!aggregate) return "100,100 100,100 100,100 100,100 100,100";

        // Normalize metrics to 0-100 scale for chart
        const knowledge = aggregate.averageScore || 0;
        const speed = Math.min(100, Math.max(0, 100 - (aggregate.averageTimePerQuestion - 5) * 5)); // Reward faster times (<5s is 100%, >25s is 0%)
        const experience = Math.min(100, aggregate.totalQuizzes * 10);
        const tenacity = Math.min(100, history.length * 5); // Mock
        const focus = Math.min(100, aggregate.bestScore);

        const metrics = [knowledge, speed, experience, tenacity, focus];
        const center = 100;
        const radius = 80;

        return metrics.map((value, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const r = (value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    };

    if (mode === 'mini' && currentSessionStats) {
        const avgTime = currentSessionStats.answeredCount > 0 ? Math.round(currentSessionStats.timeElapsed / currentSessionStats.answeredCount) : 0;
        const accuracy = currentSessionStats.answeredCount > 0 ? Math.round((currentSessionStats.currentStreak / currentSessionStats.answeredCount) * 100) : 0;

        return (
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-4 mb-6">
                <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Activity size={14} /> Live Session Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                        <div className="text-slate-400 text-xs mb-1">Avg Time</div>
                        <div className="text-xl font-bold text-blue-400 font-mono">{avgTime}s</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                        <div className="text-slate-400 text-xs mb-1">Est. Accuracy</div>
                        <div className="text-xl font-bold text-green-400 font-mono">~{accuracy}%</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                        <div className="text-slate-400 text-xs mb-1">Current Streak</div>
                        <div className="text-xl font-bold text-orange-400 font-mono">{currentSessionStats.currentStreak}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                        <div className="text-slate-400 text-xs mb-1">Best Streak</div>
                        <div className="text-xl font-bold text-purple-400 font-mono">{currentSessionStats.longestStreak}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl mx-auto p-4 md:p-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl"
                >
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="text-right">
                    <h1 className="text-3xl font-display font-bold text-white">Pro Stats Dashboard</h1>
                    <p className="text-slate-400 text-sm">Visualizing your Ad Tech mastery</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Quizzes', value: aggregate?.totalQuizzes || 0, icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Avg Knowledge', value: (aggregate?.averageScore || 0) + '%', icon: Target, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Avg Speed', value: (aggregate?.averageTimePerQuestion || 0) + 's', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Best Score', value: (aggregate?.bestScore || 0) + '%', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 p-2 rounded-bl-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div className="text-slate-400 text-sm font-medium mb-2">{stat.label}</div>
                        <div className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Radar Chart */}
                <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative">
                    <h3 className="text-lg font-bold text-white mb-6 w-full text-left">Attribute Analysis</h3>
                    <div className="relative w-64 h-64">
                        {/* Background Pentagons */}
                        {[0.8, 0.6, 0.4, 0.2].map(scale => (
                            <svg key={scale} className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
                                <polygon
                                    points="100,20 176,76 147,168 53,168 24,76"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                    transform={`scale(${scale})`}
                                    style={{ transformOrigin: 'center' }}
                                />
                            </svg>
                        ))}
                        {/* Labels */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 text-xs text-green-400 font-bold">Knowledge</div>
                        <div className="absolute top-[28%] right-0 -mr-4 text-xs text-blue-400 font-bold">Speed</div>
                        <div className="absolute bottom-[15%] right-0 -mr-2 text-xs text-indigo-400 font-bold">Experience</div>
                        <div className="absolute bottom-[15%] left-0 -ml-2 text-xs text-purple-400 font-bold">Tenacity</div>
                        <div className="absolute top-[28%] left-0 -ml-4 text-xs text-amber-400 font-bold">Focus</div>

                        {/* Data Polygon */}
                        <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" viewBox="0 0 200 200">
                            <motion.polygon
                                initial={{ points: "100,100 100,100 100,100 100,100 100,100" }}
                                animate={{ points: calculateRadarPoints() }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                fill="rgba(34, 211, 238, 0.2)"
                                stroke="#22d3ee"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-brand-400" /> Recent Performance
                    </h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="text-center text-slate-500 py-12">No attempts recorded yet. Take a quiz to accumulate data!</div>
                        ) : (
                            history.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${item.percentage >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">Adventure #{history.length - idx}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <Calendar size={10} /> {new Date(item.date).toLocaleDateString()}
                                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                {item.chapterId}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">{item.score}/{item.totalQuestions}</div>
                                        <div className={`text-xs font-bold ${item.percentage >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
                                            {item.percentage}%
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Insight Text */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 text-center">
                <p className="text-indigo-200 text-sm">
                    <Zap size={16} className="inline mr-2 text-indigo-400" />
                    <strong>Pro Tip:</strong> Focus on maintaining your streak. Your "Speed" metric indicates high proficiency, but "Accuracy" in Data concepts needs improvement.
                </p>
            </div>
        </motion.div>
    );
};

