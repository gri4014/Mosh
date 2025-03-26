import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaJson {
    type UserSelect = {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      instagramAccounts?: boolean | {
        select?: {
          id?: boolean;
          username?: boolean;
          accountType?: boolean;
          businessId?: boolean;
        };
      };
    };

    type UserWhereInput = {
      id?: string;
      email?: string;
    };

    type UserCreateInput = {
      email: string;
      password: string;
    };
  }
}

export {};
