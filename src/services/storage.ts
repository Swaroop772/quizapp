
export interface QuizResult {
    id: string;
    date: string;
    chapterId: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    percentage: number;
}

const STORAGE_KEY = 'adtech_quiz_stats';

export const storage = {
    saveResult: (result: Omit<QuizResult, 'id' | 'date'>) => {
        const stats = storage.getHistory();
        const newResult: QuizResult = {
            ...result,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        stats.unshift(newResult);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
        return newResult;
    },

    getHistory: (): QuizResult[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse stats', e);
            return [];
        }
    },

    getAggregateStats: () => {
        const history = storage.getHistory();
        if (history.length === 0) return null;

        const totalQuizzes = history.length;
        const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
        const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
        const totalTime = history.reduce((acc, curr) => acc + curr.timeSpent, 0);
        const bestScore = Math.max(...history.map(h => h.percentage));

        // Calculate category mastery (mocked if no category data, but we have chapterId)
        const masteryByChapter: Record<string, { total: number, score: number }> = {};
        history.forEach(h => {
            if (!masteryByChapter[h.chapterId]) masteryByChapter[h.chapterId] = { total: 0, score: 0 };
            masteryByChapter[h.chapterId].total += h.totalQuestions;
            masteryByChapter[h.chapterId].score += h.score;
        });

        return {
            totalQuizzes,
            averageScore: Math.round((totalScore / totalQuestions) * 100) || 0,
            averageTimePerQuestion: Math.round(totalTime / totalQuestions) || 0,
            bestScore,
            mastery: masteryByChapter
        };
    }
};
