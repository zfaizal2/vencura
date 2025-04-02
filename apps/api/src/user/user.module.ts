import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
@Module({
  imports: [AuthModule],
  providers: [UserService, PrismaService, AuthService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
