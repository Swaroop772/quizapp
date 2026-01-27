import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/scores - Submit a new score
router.post('/', async (req, res) => {
    try {
        const { name, score, totalQuestions, timeUsed, chapterId = 'overall' } = req.body;

        // Validation
        if (!name || score === undefined || !totalQuestions || !timeUsed) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const percentage = Math.round((score / totalQuestions) * 100);

        const newScore = await prisma.score.create({
            data: {
                name,
                score,
                totalQuestions,
                timeUsed,
                percentage,
                chapterId
            },
        });

        // Calculate rank for this score
        const where = chapterId ? { chapterId } : {};
        const betterScores = await prisma.score.count({
            where: {
                ...where,
                OR: [
                    { percentage: { gt: percentage } },
                    {
                        AND: [
                            { percentage: percentage },
                            { timeUsed: { lt: timeUsed } }
                        ]
                    }
                ]
            }
        });

        const rank = betterScores + 1;

        res.status(201).json({ ...newScore, rank });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// GET /api/scores - Get leaderboard (top 10)
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const chapterId = req.query.chapterId as string;

        const where = chapterId ? { chapterId } : {};

        const scores = await prisma.score.findMany({
            where,
            orderBy: [
                { percentage: 'desc' },
                { timeUsed: 'asc' },
            ],
            take: limit,
        });

        res.json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// GET /api/scores/stats - Get overall statistics
router.get('/stats', async (req, res) => {
    try {
        const totalAttempts = await prisma.score.count();

        const avgScore = await prisma.score.aggregate({
            _avg: {
                percentage: true,
                timeUsed: true,
            },
        });

        const highestScore = await prisma.score.findFirst({
            orderBy: [
                { percentage: 'desc' },
                { timeUsed: 'asc' },
            ],
        });

        res.json({
            totalAttempts,
            averagePercentage: Math.round(avgScore._avg.percentage || 0),
            averageTime: Math.round(avgScore._avg.timeUsed || 0),
            highestScore,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;
