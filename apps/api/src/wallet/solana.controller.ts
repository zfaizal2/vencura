import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SolanaService } from './solana/solana.service';
import { CreateWalletDto } from '@repo/api/wallet/create-wallet.dto';
import { OwnerGuard } from '../user/owner.guard';
@Controller('wallet/solana')
export class SolanaController {
    constructor(private readonly solanaService: SolanaService) {}

    @Post()
    @UseGuards(OwnerGuard)
    async createWallet(@Body() walletParams: CreateWalletDto) {
        const wallet = {
            ...walletParams,
        }
        return this.solanaService.createWallet(wallet);
    }
}
