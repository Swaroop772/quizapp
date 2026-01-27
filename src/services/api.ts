const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/scores';

export interface ScoreData {
    name: string;
    score: number;
    totalQuestions: number;
    timeUsed: number;
    percentage?: number;
    chapterId?: string;
    createdAt?: string;
}

export interface StatsData {
    totalAttempts: number;
    averagePercentage: number;
    averageTime: number;
    highestScore: ScoreData | null;
}

export const api = {
    // Submit a new score
    submitScore: async (scoreData: ScoreData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit score');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Get leaderboard
    getLeaderboard: async (limit: number = 10, chapterId: string = 'overall'): Promise<ScoreData[]> => {
        try {
            const url = new URL(API_URL);
            url.searchParams.append('limit', limit.toString());
            if (chapterId) {
                url.searchParams.append('chapterId', chapterId);
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    // Get stats
    getStats: async (): Promise<StatsData | null> => {
        try {
            const response = await fetch(`${API_URL}/stats`);
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }
};
