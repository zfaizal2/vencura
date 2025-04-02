
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
          data,
        });
      }

      async getUser(authId: string): Promise<User> {
        return this.prisma.user.findFirst({
          where: { auth_id: authId },
          include: {
            Wallet: true
          }
        });
      }
}
