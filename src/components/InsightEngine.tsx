import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, CheckCircle, AlertTriangle, Lightbulb, XCircle, ChevronRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playError, playClick } from '../utils/sound';

interface InsightLoopData {
    loops: {
        id: string;
        title: string;
        concept: string;
        primer: string;
        questions: {
            id: string;
            type: string;
            scenario?: string;
            question: string;
            options: { id: string; text: string; errorType: string }[];
            correctOptionId: string;
            reasoningStep: {
                prompt: string;
                options: { id: string; text: string }[];
                correctReasonId: string;
            };
        }[];
    }[];
}

interface InsightEngineProps {
    data: InsightLoopData;
    onComplete: (results: any) => void;
    onBack: () => void;
}

export const InsightEngine: React.FC<InsightEngineProps> = ({ data, onComplete, onBack }) => {
    const [currentLoopIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState<'primer' | 'question' | 'reasoning' | 'feedback'>('primer');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

    const currentLoop = data.loops[currentLoopIndex];

    // Shuffle questions on mount
    React.useEffect(() => {
        if (currentLoop?.questions) {
            const shuffled = [...currentLoop.questions].sort(() => 0.5 - Math.random());
            setShuffledQuestions(shuffled);
        }
    }, [currentLoop]);

    const currentQ = shuffledQuestions[questionIndex];

    // Wait for shuffle
    if (!currentQ && currentStep !== 'primer') return null;

    // User State 
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [stats, setStats] = useState({ correct: 0, lucky: 0, logicalErrors: 0, conceptualErrors: 0 });

    const handleAnswerSelect = (optId: string) => {
        playClick();
        setSelectedAnswer(optId);
        setCurrentStep('reasoning');
    };

    const handleReasonSelect = (reasonId: string) => {
        playClick();
        setSelectedReason(reasonId);
        setCurrentStep('feedback');

        // Analyze Mistake
        const isAnswerCorrect = selectedAnswer === currentQ.correctOptionId;
        const isReasonCorrect = reasonId === currentQ.reasoningStep.correctReasonId;

        if (isAnswerCorrect && isReasonCorrect) {
            playSuccess();
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#a855f7'] });
            setStats(p => ({ ...p, correct: p.correct + 1 }));
        } else if (isAnswerCorrect && !isReasonCorrect) {
            // Lucky Guess
            setStats(p => ({ ...p, lucky: p.lucky + 1 }));
        } else {
            playError();
            // Look up error type
            const errorType = currentQ.options.find((o: any) => o.id === selectedAnswer)?.errorType;
            if (errorType && errorType !== 'None') {
                // Simplified for now - assume all wrong answers map to a gap
                setStats((p: any) => ({ ...p, conceptualErrors: p.conceptualErrors + 1 }));
            }
        }
    };

    const handleNext = () => {
        if (questionIndex < shuffledQuestions.length - 1) {
            setQuestionIndex(i => i + 1);
            setCurrentStep('question');
            setSelectedAnswer(null);
            setSelectedReason(null);
        } else {
            // Loop Complete
            // TODO: Move to next loop or finish
            onComplete(stats);
        }
    };

    // Render Helpers
    const renderPrimer = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto p-8 bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="flex items-start gap-5 mb-8">
                <div className="p-4 bg-gradient-to-br from-brand-500/20 to-accent-500/20 rounded-2xl border border-white/10 shadow-inner">
                    <Brain className="w-10 h-10 text-brand-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                        Mastermind Protocol Initiated
                    </h2>
                    <h1 className="text-3xl font-display font-bold text-white leading-tight">{currentLoop.concept}</h1>
                </div>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed mb-10 pl-2 border-l-2 border-slate-700">
                {currentLoop.primer}
            </p>
            <button
                onClick={() => setCurrentStep('question')}
                className="w-full py-4 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-brand-500/25 border border-white/10 group"
            >
                <span>Enter Scenario Simulation</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );

    const renderReasoning = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                        <Brain size={12} /> Reliability Check
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white leading-snug">
                        {currentQ.reasoningStep.prompt}
                    </h2>
                </div>

                <div className="space-y-4">
                    {currentQ.reasoningStep.options.map((r: any, idx: number) => (
                        <motion.button
                            key={r.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleReasonSelect(r.id)}
                            className="w-full p-5 text-left bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all font-medium text-slate-300 hover:text-white group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">{r.text}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const renderFeedback = () => {
        const isAnswerCorrect = selectedAnswer === currentQ.correctOptionId;
        const isReasonCorrect = selectedReason === currentQ.reasoningStep.correctReasonId;

        let title = "";
        let colorClass = "";
        let Icon = CheckCircle;
        let borderColor = "";

        if (isAnswerCorrect && isReasonCorrect) {
            title = "Mastery Confirmed";
            colorClass = "text-green-400";
            borderColor = "border-green-500/50";
            Icon = Zap;
        } else if (isAnswerCorrect && !isReasonCorrect) {
            title = "Intuition Gap";
            colorClass = "text-yellow-400";
            borderColor = "border-yellow-500/50";
            Icon = AlertTriangle;
        } else {
            title = "Concept Divergence";
            colorClass = "text-red-400";
            borderColor = "border-red-500/50";
            Icon = XCircle;
        }

        return (
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-2xl mx-auto p-8 bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl text-center border-t-4 ${borderColor} relative overflow-hidden`}
            >
                <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-${colorClass.split('-')[1]}-500 to-transparent opacity-50`} />

                <div className={`inline-flex p-4 rounded-2xl mb-6 bg-white/5 border border-white/10 shadow-lg ${colorClass}`}>
                    <Icon className="w-12 h-12" />
                </div>

                <h2 className={`text-3xl font-display font-bold text-white mb-2`}>{title}</h2>
                <p className="text-slate-400 mb-8">{isAnswerCorrect && isReasonCorrect ? "Perfect alignment of answer and reasoning." : "Let's align your mental model with the ecosystem."}</p>

                <div className="text-left bg-black/20 p-6 rounded-2xl mb-8 border border-white/5 relative">
                    <div className="absolute top-0 left-6 -translate-y-1/2 bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-400 uppercase tracking-widest border border-white/10">
                        The Core Concept
                    </div>
                    <p className="text-white text-lg leading-relaxed">
                        {currentQ.reasoningStep.options.find((r: any) => r.id === currentQ.reasoningStep.correctReasonId)?.text}
                    </p>
                </div>

                <button
                    onClick={handleNext}
                    className="w-full px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                >
                    <span>Next Simulation</span>
                    <ChevronRight size={20} />
                </button>
            </motion.div>
        );
    };

    if (currentStep === 'primer') return renderPrimer();
    if (currentStep === 'reasoning') return renderReasoning();
    if (currentStep === 'feedback') return renderFeedback();

    return (
        <div className="w-full max-w-2xl mx-auto p-4 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -z-10" />

            {/* Scenario Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl text-white p-8 rounded-[2rem] shadow-2xl border border-white/10 mb-8 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />

                <div className="flex items-center gap-2 mb-4 text-indigo-300 text-xs font-bold uppercase tracking-widest relative z-10">
                    <div className="p-1 bg-indigo-500/20 rounded border border-indigo-500/30">
                        <Lightbulb size={14} />
                    </div>
                    Market Scenario
                </div>
                <p className="text-xl md:text-2xl font-medium leading-relaxed font-display text-indigo-50 relative z-10">
                    "{currentQ.scenario}"
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl md:text-2xl font-medium text-slate-300 mb-6 px-4 leading-relaxed">
                    {currentQ.question}
                </h2>

                <div className="space-y-4">
                    {currentQ.options.map((opt: any, idx: number) => (
                        <motion.button
                            key={opt.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            onClick={() => handleAnswerSelect(opt.id)}
                            className="w-full p-5 text-left bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl hover:border-indigo-500 hover:bg-indigo-500/10 transition-all duration-300 font-medium text-slate-300 hover:text-white group flex items-center gap-4 hover:translate-x-1 hover:shadow-lg hover:shadow-indigo-500/10"
                        >
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <button onClick={onBack} className="mt-12 w-full text-slate-500 hover:text-slate-400 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <XCircle size={16} /> Abort Simulation
            </button>
        </div>
    );
};
