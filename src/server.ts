import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import webhookRouter from './routes/webhook';
import instagramRouter from './routes/instagram';
import { errorHandler } from './middleware/error';
import { logger } from './utils/logger';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/auth', authRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/instagram', instagramRouter);

// Error handling
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Handle shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing HTTP server and database connections');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
