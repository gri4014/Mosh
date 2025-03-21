import { Prisma } from '@prisma/client';

// Define types for nested includes
export type InstagramAccountWithUser = Prisma.InstagramAccountGetPayload<{
  include: { user: true };
}>;

// Define input types
export type InstagramAccountUpdateInput = Prisma.InstagramAccountUpdateInput;
export type InstagramAccountCreateInput = Prisma.InstagramAccountCreateInput;
export type UserCreateInput = Prisma.UserCreateInput;
