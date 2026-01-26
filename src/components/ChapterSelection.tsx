import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, BookOpen, ArrowLeft } from 'lucide-react';
import questionsData from '../data/questions.json';

interface ChapterSelectionProps {
    onSelectChapter: (chapterId: string) => void;
    completedChapters: string[];
    onBack: () => void; // New prop
}

export const ChapterSelection: React.FC<ChapterSelectionProps> = ({
    onSelectChapter,
    completedChapters,
    onBack, // Destructure new prop
}) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 relative"> {/* Added relative for absolute positioning */}
            <button
                onClick={onBack}
                className="absolute left-4 top-4 md:left-8 md:top-8 p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-full bg-white dark:bg-slate-800 shadow-md"
                title="Back to Start"
            >
                <ArrowLeft size={24} />
            </button>

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 mb-4">
                    Select a Module
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Choose a chapter from "The AdTech Book" to test your knowledge.
                    Master all 11 modules to become an Ad Tech Expert.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Overall / Comprehensive Exam Card */}
                <motion.div
                    variants={item}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => onSelectChapter('overall')}
                    className="relative overflow-hidden rounded-2xl p-6 cursor-pointer border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-500 hover:shadow-xl dark:hover:border-purple-400 transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-center gap-6"
                >
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Star size={32} fill="currentColor" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Comprehensive Final Exam
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            Test your mastery of the entire ecosystem! Includes questions from all 11 chapters with shuffled choices and randomized order.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-semibold border border-purple-200 dark:border-purple-700">
                                {questionsData.chapters.reduce((acc, c) => acc + c.questions.length, 0)} Questions Available
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-700">
                                Smart Shuffle
                            </span>
                        </div>
                    </div>

                    <button className="flex-shrink-0 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                        Start Final Exam <Play size={20} fill="currentColor" />
                    </button>
                </motion.div>

                {questionsData.chapters.map((chapter, index) => {
                    const isCompleted = completedChapters.includes(chapter.id);
                    const questionCount = chapter.questions.length;

                    return (
                        <motion.div
                            key={chapter.id}
                            variants={item}
                            whileHover={{ y: -5, scale: 1.02 }}
                            onClick={() => onSelectChapter(chapter.id)}
                            className={`
                relative overflow-hidden rounded-2xl p-6 cursor-pointer border-2 transition-all duration-300
                ${isCompleted
                                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:shadow-xl dark:hover:border-brand-500/50'
                                }
`}
                        >
                            {isCompleted && (
                                <div className="absolute top-4 right-4">
                                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                </div>
                            )}

                            <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/30 dark:to-accent-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl">
                                {index + 1}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {chapter.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                                {chapter.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                                    {questionCount} Questions
                                </span>

                                <button className="flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                                    Start Quiz <Play size={16} fill="currentColor" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700">
                                <div
                                    className="h-full bg-brand-500"
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 shadow-sm">
                    <BookOpen size={16} />
                    <span>Curriculum based on "The AdTech Book" (2025 Edition)</span>
                </div>
            </div>
        </div>
    );
};
