import type { Prisma } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
  token?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Prisma Select Types
export const defaultUserSelect = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true
} as const;

export const defaultUserWithPasswordSelect = {
  ...defaultUserSelect,
  password: true
} as const;

export const instagramAccountSelect = {
  id: true,
  username: true,
  accountType: true,
  businessId: true
} as const;

// Result Types
export type UserSelect = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = UserSelect & {
  password: string;
};

export type InstagramAccountSelect = {
  id: string;
  username: string;
  accountType: Prisma.InstagramAccountCreateInput['accountType'];
  businessId: string | null;
};

export interface AuthResponse extends UserSelect {
  token: string;
}

export interface UserWithInstagramAccounts extends UserSelect {
  instagramAccounts: InstagramAccountSelect[];
}
