import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Edit2 } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface ReviewBeforeSubmitProps {
    questions: Question[];
    userAnswers: Record<number, string>;
    onEditQuestion: (index: number) => void;
    onConfirmSubmit: () => void;
    onCancel: () => void;
}

export const ReviewBeforeSubmit: React.FC<ReviewBeforeSubmitProps> = ({
    questions,
    userAnswers,
    onEditQuestion,
    onConfirmSubmit,
    onCancel,
}) => {
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = questions.length - answeredCount;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto p-4"
        >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Review Your Answers</h2>
                <p className="text-slate-600 mb-6">
                    Check your answers before submitting. You can still make changes.
                </p>

                {unansweredCount > 0 && (
                    <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <p className="font-semibold text-orange-900">
                                Warning: {unansweredCount} question{unansweredCount > 1 ? 's' : ''} unanswered
                            </p>
                        </div>
                        <p className="text-sm text-orange-700 mt-1">
                            You can still submit, but unanswered questions will be marked as incorrect.
                        </p>
                    </div>
                )}

                <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6">
                    {questions.map((q, index) => {
                        const hasAnswer = userAnswers[index] !== undefined;

                        return (
                            <div
                                key={q.id}
                                className={`p-4 rounded-lg border-2 transition-all ${hasAnswer
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-orange-300 bg-orange-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {hasAnswer ? (
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                            )}
                                            <h3 className="font-semibold text-slate-900">
                                                Question {index + 1}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-slate-700 mb-2">{q.question}</p>
                                        {hasAnswer ? (
                                            <div className="mt-2 p-2 bg-white rounded border border-slate-200">
                                                <p className="text-sm">
                                                    <span className="font-medium text-slate-600">Your answer:</span>{' '}
                                                    <span className="text-slate-900">{userAnswers[index]}</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-orange-700 italic">No answer selected</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onEditQuestion(index)}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all flex items-center gap-2 text-sm font-medium text-slate-700"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-4 items-center justify-end pt-4 border-t border-slate-200">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-all"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onConfirmSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95"
                    >
                        Confirm & Submit
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
