import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scoresRouter from './routes/scores';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scores', scoresRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Ad Tech Quiz API is running' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
