import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';
import { requireFields } from '../middleware/validation';
import { RegisterRequest, LoginRequest } from '../types/auth';

const router = express.Router();

// Auth routes
router.post('/register', requireFields(['email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);

export default router;
