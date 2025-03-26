import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  AuthenticatedRequest, 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse,
  UserWithInstagramAccounts,
  UserSelect,
  UserWithPassword,
  defaultUserSelect,
  defaultUserWithPasswordSelect,
  instagramAccountSelect
} from '../types/auth';

const prisma = new PrismaClient();

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: lowercaseEmail
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: lowercaseEmail,
        password: hashedPassword
      },
      select: defaultUserSelect
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response: AuthResponse = {
      ...newUser,
      token
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error('Registration error', { error });
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const lowercaseEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: lowercaseEmail
      },
      select: defaultUserWithPasswordSelect
    }) as UserWithPassword | null;

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = user;
    const response: AuthResponse = {
      ...userData,
      token
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Login error', { error });
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        ...defaultUserSelect,
        instagramAccounts: {
          select: instagramAccountSelect
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const response: UserWithInstagramAccounts = {
      ...user,
      instagramAccounts: user.instagramAccounts
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error('Get current user error', { error });
    res.status(500).json({ error: 'Failed to get user data' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error', { error });
    res.status(500).json({ error: 'Logout failed' });
  }
};
