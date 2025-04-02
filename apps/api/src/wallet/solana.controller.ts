import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { SolanaService } from './solana/solana.service';
import { CreateWalletDto } from '@repo/api/wallet/create-wallet.dto';
import { OwnerGuard } from '../user/owner.guard';
import { SendTransactionDto } from '@repo/api/wallet/send-transaction.dto';
import { SignMessageDto } from '@repo/api/wallet/sign-message.dto';
import { DynamicAuthGuard } from '../auth/dynamic.guard';
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

    @Get(':userAuthId')
    @UseGuards(DynamicAuthGuard)
    async getWallet(@Param('userAuthId') userAuthId: string) {
        return this.solanaService.getWalletsByOwner(userAuthId);
    }

    @Get(':publicKey/balance')
    @UseGuards(DynamicAuthGuard)
    async getBalance(@Param('publicKey') publicKey: string) {
        return this.solanaService.getBalance(publicKey);
    }

    @Post('/sendTransaction')
    @UseGuards(OwnerGuard)
    async sendTransaction(@Body() body: SendTransactionDto) {
        return this.solanaService.sendTransaction(body.publicKey, body.to, body.amount);
    }

    @Post('/signMessage')
    @UseGuards(OwnerGuard)
    async signMessage(@Body() body: SignMessageDto) {
        return this.solanaService.signMessage(body.publicKey, body.message);
    }
}
