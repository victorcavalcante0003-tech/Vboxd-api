import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import logRoutes from './routes/log.routes';
import commentsRoutes from './routes/comments.routes';
import { errorHandler } from './middlewares/errorHandler';
import { globalLimiter } from './middlewares/rateLimiter';

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(globalLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/logs', logRoutes);
app.use('/comments', commentsRoutes);

app.use(errorHandler);

export default app;