import { Module } from '@nestjs/common';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana/solana.service';

@Module({
  controllers: [SolanaController],
  providers: [SolanaService]
})
export class WalletModule {}
