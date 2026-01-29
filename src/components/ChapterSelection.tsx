import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, BookOpen, ArrowLeft, Award, Zap } from 'lucide-react';
import questionsData from '../data/questions.json';

interface ChapterSelectionProps {
    onSelectChapter: (chapterId: string) => void;
    completedChapters: string[];
    onBack: () => void;
}

export const ChapterSelection: React.FC<ChapterSelectionProps> = ({
    onSelectChapter,
    completedChapters,
    onBack,
}) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 30, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                stiffness: 50,
                damping: 20
            }
        }
    };

    const totalAvailableQuestions = questionsData.chapters.reduce((acc, c) => acc + c.questions.length, 0);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10">
            {/* Header Section */}
            <div className="relative mb-12 md:mb-16">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1 p-3 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-xl border border-transparent hover:border-white/10 group backdrop-blur-sm"
                    title="Back to Start"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center px-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-4 animate-float">
                        <Zap size={14} className="fill-brand-500 text-brand-500" />
                        <span>Level Up Your Skills</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-accent-200 mb-6 drop-shadow-sm tracking-tight">
                        Select a Module
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Master the complexities of the Ad Tech ecosystem one chapter at a time.
                        <span className="block mt-2 hidden md:block">Complete all modules to unlock the expert certification.</span>
                    </p>
                </motion.div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
            >
                {/* Overall / Comprehensive Exam Card - Hero Card */}
                <motion.div
                    variants={item}
                    whileHover={{ y: -8, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectChapter('overall')}
                    className="relative overflow-hidden group rounded-3xl p-1 cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 transition-shadow duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                    {/* Animated Gradient Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 opacity-60 blur-sm group-hover:blur-md transition-all duration-500" />

                    <div className="relative h-full bg-slate-900/90 backdrop-blur-xl rounded-[1.3rem] p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex-shrink-0 relative group-hover:scale-110 transition-transform duration-500 ease-in-out">
                            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-40 animate-pulse-glow" />
                            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 border border-white/20">
                                <Award size={40} className="animate-float" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left z-10">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30 uppercase tracking-wider">
                                    Boss Level
                                </span>
                            </div>
                            <h3 className="text-3xl font-display font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                                Comprehensive Final Exam
                            </h3>
                            <p className="text-slate-300 text-lg font-light mb-6 md:pr-12">
                                Prove your mastery across the entire ecosystem. <span className="text-white font-medium">50 random questions</span> from all 11 chapters.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                                    <BookOpen size={14} className="text-purple-400" />
                                    <span>{totalAvailableQuestions} Questions Pool</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                                    <Zap size={14} className="text-yellow-400" />
                                    <span>Smart Shuffle</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 z-10">
                            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/40 transition-all transform group-hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/10">
                                <span>Start Final Exam</span>
                                <div className="bg-white/20 rounded-full p-1">
                                    <Play size={16} fill="currentColor" />
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {questionsData.chapters.map((chapter, index) => {
                    const isCompleted = completedChapters.includes(chapter.id);

                    return (
                        <motion.div
                            key={chapter.id}
                            variants={item}
                            whileHover={{ y: -8, scale: 1.02, zIndex: 10 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectChapter(chapter.id)}
                            className={`
                                relative group overflow-hidden rounded-3xl cursor-pointer transition-all duration-500
                                bg-slate-800/50 backdrop-blur-xl border border-white/5
                                hover:shadow-2xl hover:bg-slate-800/80
                                ${isCompleted ? 'shadow-green-900/20' : 'shadow-black/20'}
                            `}
                        >
                            {/* Hover Border Gradient */}
                            <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-white/10 transition-colors pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
                                        ${isCompleted
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30'
                                            : 'bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-accent-500 group-hover:text-white group-hover:shadow-brand-500/30'
                                        }
                                    `}>
                                        {isCompleted ? <Award size={28} className="animate-float" /> : (index + 1)}
                                    </div>

                                    {isCompleted && (
                                        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                            Completed <Award size={12} />
                                        </div>
                                    )}
                                </div>

                                <h3 className={`text-2xl font-display font-bold mb-3 transition-colors ${isCompleted ? 'text-green-400' : 'text-white group-hover:text-brand-300'}`}>
                                    {chapter.title}
                                </h3>

                                <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2 md:line-clamp-none group-hover:text-slate-300 transition-colors">
                                    {chapter.description}
                                </p>

                                <div className="mt-auto border-t border-white/5 pt-6 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 group-hover:text-slate-400 transition-colors">
                                            Length
                                        </span>
                                        <span className="text-sm font-medium text-slate-300">
                                            10 Questions
                                        </span>
                                    </div>

                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-white/5 text-slate-400 group-hover:bg-brand-500 group-hover:text-white'
                                        }
                                    `}>
                                        {isCompleted
                                            ? <Star size={18} fill="currentColor" />
                                            : <Play size={18} fill="currentColor" className="ml-0.5" />
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar for styling */}
                            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-900/50">
                                <motion.div
                                    className={`h-full ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-brand-500 to-accent-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: isCompleted ? '100%' : '0%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-center"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/5 text-sm text-slate-400 hover:bg-slate-800/60 transition-colors">
                    <BookOpen size={16} className="text-brand-400" />
                    <span>Curriculum based on <span className="text-slate-200 font-medium">"The AdTech Book" (2025 Edition)</span></span>
                </div>
            </motion.div>
        </div>
    );
};
