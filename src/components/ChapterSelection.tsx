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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-sm font-bold mb-4 animate-float uppercase tracking-wider font-ninja">
                        <Zap size={14} className="fill-brand-500 text-brand-500" />
                        <span>Chunin Exam Protocol</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-ninja font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-orange-500 to-red-500 mb-6 drop-shadow-sm tracking-tight stroke-white stroke-2" style={{ WebkitTextStroke: '1px white' }}>
                        Select Mission
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
                    className="relative overflow-hidden group rounded-xl p-1 cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 transition-shadow duration-500 hover:shadow-2xl hover:shadow-red-500/30"
                >
                    {/* Scroll Rollers */}
                    <div className="absolute top-0 left-2 right-2 h-4 bg-[#8b5a2b] rounded-full z-20 shadow-md" />
                    <div className="absolute bottom-0 left-2 right-2 h-4 bg-[#8b5a2b] rounded-full z-20 shadow-md" />

                    <div className="relative h-full bg-[#fdfbf7] rounded-lg p-8 pt-10 pb-10 border-x-4 border-[#f4e4bc] shadow-inner flex flex-col md:flex-row items-center gap-8 overflow-hidden">
                        {/* Paper Texture */}
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none" />

                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex-shrink-0 relative group-hover:scale-110 transition-transform duration-500 ease-in-out z-10">
                            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse-glow" />
                            <div className="relative w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-red-500 border-4 border-red-500 shadow-xl">
                                <Award size={40} className="animate-float" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left z-10">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black border border-red-200 uppercase tracking-widest font-ninja">
                                    S-Rank Mission
                                </span>
                            </div>
                            <h3 className="text-3xl font-ninja font-bold text-slate-800 mb-3 group-hover:text-red-700 transition-colors">
                                Hokage Qualification Exam
                            </h3>
                            <p className="text-slate-600 text-lg font-medium mb-6 md:pr-12">
                                Prove your mastery across the entire ecosystem. <span className="text-red-600 font-bold bg-red-50 px-1 rounded">50 random questions</span> from all villages.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-sm text-slate-500 bg-black/5 py-1.5 px-3 rounded-lg border border-black/5 font-mono font-bold">
                                    <BookOpen size={14} className="text-slate-700" />
                                    <span>{totalAvailableQuestions} Jutsu Available</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 bg-black/5 py-1.5 px-3 rounded-lg border border-black/5 font-mono font-bold">
                                    <Zap size={14} className="text-yellow-600" />
                                    <span>Smart Shuffle</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 z-10">
                            <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/30 transition-all transform group-hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-red-800 font-ninja">
                                <span>Start Exam</span>
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
                                relative group overflow-hidden rounded-xl cursor-pointer transition-all duration-500
                                bg-[#fdfbf7] border-x-4 border-[#f4e4bc] shadow-md
                                hover:shadow-2xl hover:shadow-orange-500/10
                            `}
                        >
                            {/* Scroll Rollers */}
                            <div className="absolute top-0 left-0 right-0 h-3 bg-[#8b5a2b] z-20" />
                            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#8b5a2b] z-20" />

                            {/* Paper Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none" />

                            <div className="p-6 md:p-8 pt-10 pb-10 flex flex-col h-full relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border-2
                                        ${isCompleted
                                            ? 'bg-green-100 text-green-700 border-green-300'
                                            : 'bg-orange-100 text-orange-600 border-orange-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-600'
                                        }
                                    `}>
                                        {isCompleted ? <Award size={20} className="animate-float" /> : (index + 1)}
                                    </div>

                                    {isCompleted && (
                                        <div className="bg-green-100 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-1">
                                            Completed <Award size={12} />
                                        </div>
                                    )}
                                </div>

                                <h3 className={`text-xl font-ninja font-bold mb-3 transition-colors ${isCompleted ? 'text-green-700' : 'text-slate-800 group-hover:text-orange-600'}`}>
                                    {chapter.title}
                                </h3>

                                <p className="text-slate-600 text-sm mb-8 leading-relaxed line-clamp-2 md:line-clamp-none group-hover:text-slate-800 transition-colors font-medium">
                                    {chapter.description}
                                </p>

                                <div className="mt-auto border-t-2 border-dashed border-slate-200 pt-6 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs uppercase tracking-wider font-bold text-slate-400 group-hover:text-slate-500 transition-colors">
                                            Mission Length
                                        </span>
                                        <span className="text-sm font-bold text-slate-700 font-mono">
                                            10 Jutsu
                                        </span>
                                    </div>

                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-slate-100 text-slate-400 group-hover:bg-orange-500 group-hover:text-white'
                                        }
                                    `}>
                                        {isCompleted
                                            ? <Star size={18} fill="currentColor" />
                                            : <Play size={18} fill="currentColor" className="ml-0.5" />
                                        }
                                    </div>
                                </div>
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
        </div >
    );
};
