import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateWalletDto } from '@repo/api/wallet/create-wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { encryptKey } from 'src/utils';
import { generateSolanaWallet } from 'src/utils/solana';


@Injectable()
export class SolanaService {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

    async createWallet(wallet: CreateWalletDto) {
        const keypair = generateSolanaWallet();
        const skey = encryptKey(keypair.secretKey, this.configService.get('PKEY_SECRET'));
        return this.prisma.wallet.create({ data: {
            label: wallet.label,
            public_key: keypair.publicKey,
            skey_hash: skey,
            owner: wallet.owner,
            network: "solana",
        } });
    }
}
