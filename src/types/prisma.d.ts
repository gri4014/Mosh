import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaTypes {
    type UserPayload = Prisma.UserGetPayload<{
      include: {
        instagramAccounts: true;
      };
    }>;

    type InstagramAccountPayload = Prisma.InstagramAccountGetPayload<{
      select: {
        id: true;
        username: true;
        accountType: true;
        businessId: true;
      };
    }>;
  }
}

export {};
