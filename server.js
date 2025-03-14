import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './src/config/database.js';
import { createLogger } from './src/utils/logger.js';
import { errorHandler, setupUnhandledRejectionHandler } from './src/middleware/error.js';

// Load environment variables
dotenv.config();

const logger = createLogger('Server');
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']  // Frontend development server
    : process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database connection test
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error('Database connection failed', { error });
    process.exit(1);
  });

// API Routes mounting points
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Future API routes will be mounted here
// app.use('/api/auth', authRouter);
// app.use('/api/instagram', instagramRouter);
// app.use('/api/subscription', subscriptionRouter);
// app.use('/api/strategy', strategyRouter);
// app.use('/api/posts', postsRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
const server = app.listen(port, () => {
  logger.info(`Mosh backend server running on port ${port}`, {
    environment: process.env.NODE_ENV,
    port
  });
});

// Graceful shutdown setup
setupUnhandledRejectionHandler(server);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });
});
