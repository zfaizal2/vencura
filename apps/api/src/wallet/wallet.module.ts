import { Module } from '@nestjs/common';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana/solana.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
@Module({ 
  imports: [PrismaModule, AuthModule],
  controllers: [SolanaController],
  providers: [SolanaService, AuthService]
})
export class WalletModule {}
