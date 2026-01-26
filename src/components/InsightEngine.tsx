import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, CheckCircle, AlertTriangle, Lightbulb, XCircle } from 'lucide-react';
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
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">New Concept Loop</h2>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentLoop.concept}</h1>
                </div>
            </div>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                {currentLoop.primer}
            </p>
            <button
                onClick={() => setCurrentStep('question')}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
                Start Scenarios <ArrowRight />
            </button>
        </motion.div>
    );

    const renderReasoning = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {currentQ.reasoningStep.prompt}
            </h2>
            <div className="space-y-4">
                {currentQ.reasoningStep.options.map((r: any) => (
                    <button
                        key={r.id}
                        onClick={() => handleReasonSelect(r.id)}
                        className="w-full p-5 text-left bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-medium text-slate-700 dark:text-slate-200"
                    >
                        {r.text}
                    </button>
                ))}
            </div>
        </motion.div>
    );

    const renderFeedback = () => {
        const isAnswerCorrect = selectedAnswer === currentQ.correctOptionId;
        const isReasonCorrect = selectedReason === currentQ.reasoningStep.correctReasonId;

        let title = "";
        let color = "";
        let Icon = CheckCircle;

        if (isAnswerCorrect && isReasonCorrect) {
            title = "Mastery: Perfect Reasoning!";
            color = "green";
            Icon = CheckCircle;
        } else if (isAnswerCorrect && !isReasonCorrect) {
            title = "Lucky Guess (Intuition Gap)";
            color = "yellow";
            Icon = AlertTriangle;
        } else {
            title = "Concept Gap Detected";
            color = "red";
            Icon = XCircle;
        }

        return (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl text-center border-t-8" style={{ borderColor: color === 'green' ? '#22c55e' : color === 'yellow' ? '#eab308' : '#ef4444' }}>
                <div className={`inline-flex p-4 rounded-full mb-6 bg-${color}-100 dark:bg-${color}-900/30`}>
                    <Icon className={`w-12 h-12 text-${color}-600`} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
                <div className="text-left bg-slate-50 dark:bg-slate-900 p-6 rounded-xl mb-8">
                    <p className="font-bold text-slate-500 text-sm uppercase mb-2">The Truth</p>
                    <p className="text-slate-900 dark:text-white">
                        {currentQ.reasoningStep.options.find((r: any) => r.id === currentQ.reasoningStep.correctReasonId)?.text}
                    </p>
                </div>
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl"
                >
                    Next Concept
                </button>
            </motion.div>
        );
    };

    if (currentStep === 'primer') return renderPrimer();
    if (currentStep === 'reasoning') return renderReasoning();
    if (currentStep === 'feedback') return renderFeedback();

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Scenario Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-3xl shadow-lg mb-8">
                <div className="flex items-center gap-2 mb-4 opacity-80 text-sm font-bold uppercase tracking-wider">
                    <Lightbulb size={16} /> Scenario
                </div>
                <p className="text-xl font-medium leading-relaxed">
                    {currentQ.scenario}
                </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 px-2">
                {currentQ.question}
            </h2>

            <div className="space-y-4">
                {currentQ.options.map((opt: any) => (
                    <button
                        key={opt.id}
                        onClick={() => handleAnswerSelect(opt.id)}
                        className="w-full p-5 text-left bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-medium text-slate-700 dark:text-slate-200"
                    >
                        {opt.text}
                    </button>
                ))}
            </div>

            <button onClick={onBack} className="mt-8 text-slate-400 hover:text-slate-600 text-sm">Exit Insight Loop</button>
        </div>
    );
};
