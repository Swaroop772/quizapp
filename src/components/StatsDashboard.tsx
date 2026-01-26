import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Zap, TrendingUp } from 'lucide-react';

interface StatsDashboardProps {
    answeredCount: number;
    timeElapsed: number;
    currentStreak: number;
    longestStreak: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
    answeredCount,
    timeElapsed,
    currentStreak,
    longestStreak,
}) => {
    const avgTimePerQuestion = answeredCount > 0 ? Math.round(timeElapsed / answeredCount) : 0;
    const estimatedAccuracy = answeredCount > 0 ? Math.round((currentStreak / answeredCount) * 100) : 0;

    const stats = [
        {
            icon: Clock,
            label: 'Avg Time',
            value: `${avgTimePerQuestion}s`,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            icon: Target,
            label: 'Predicted Score',
            value: `~${estimatedAccuracy}%`,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            icon: Zap,
            label: 'Current Streak',
            value: currentStreak,
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-100 dark:bg-orange-900/30',
        },
        {
            icon: TrendingUp,
            label: 'Best Streak',
            value: longestStreak,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-100 dark:bg-purple-900/30',
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                Live Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bg} rounded-lg p-3`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                {stat.label}
                            </span>
                        </div>
                        <div className={`text-xl font-bold ${stat.color}`}>
                            {stat.value}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
