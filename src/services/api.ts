const API_URL = 'http://localhost:3001/api/scores';

export interface ScoreData {
    name: string;
    score: number;
    totalQuestions: number;
    timeUsed: number;
    percentage?: number;
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
    getLeaderboard: async (limit: number = 10): Promise<ScoreData[]> => {
        try {
            const response = await fetch(`${API_URL}?limit=${limit}`);
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
