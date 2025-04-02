import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wallet } from '@prisma/client';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { CreateWalletDto } from '@repo/api/wallet/create-wallet.dto';
import { Connection } from '@solana/web3.js';
import { PrismaService } from 'src/prisma/prisma.service';
import { decryptKey, encryptKey } from 'src/utils';
import { generateSolanaWallet } from 'src/utils/solana';
import * as nacl from 'tweetnacl';
import * as nacl_util from 'tweetnacl-util';

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

    async getWallet(publicKey: string) {
        return this.prisma.wallet.findUnique({ where: { public_key: publicKey } });
    }

    async getWalletsByOwner(owner: string) {
        return this.prisma.wallet.findMany({ where: { owner }, select: {
            public_key: true,
            label: true,
            network: true,
            created_at: true,
            updated_at: true,
        } });
    }

    async getBalance(publicKey: string) {
        const connection = new Connection(this.configService.get('SOLANA_RPC_URL'));
        const balance = await connection.getBalance(new PublicKey(publicKey));
        return balance;
    }

    async sendTransaction(publicKey: string, to: string, amount: number) {
        const wallet = await this.getWallet(publicKey);
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        const connection = new Connection(this.configService.get('SOLANA_RPC_URL'));
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(wallet.public_key),
                toPubkey: new PublicKey(to), 
                lamports: amount
            })
        );

        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = new PublicKey(wallet.public_key);
        const sKey = decryptKey(wallet.skey_hash, this.configService.get('PKEY_SECRET'));
        const keypair = Keypair.fromSecretKey(Buffer.from(sKey, 'base64'));
        transaction.sign(keypair);
        const signature = await connection.sendRawTransaction(transaction.serialize());
        return {signature};
    }

    async signMessage(publicKey: string, message: string) {
        const wallet = await this.getWallet(publicKey);
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        const sKey = decryptKey(wallet.skey_hash, this.configService.get('PKEY_SECRET'));
        const keypair = Keypair.fromSecretKey(Buffer.from(sKey, 'base64'));
        const messageBytes = nacl_util.decodeUTF8(message);
        const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
        return {signed_message: nacl_util.encodeBase64(signature)};
    }

    async verifyMessage(wallet: Wallet, message: string, signature: string) {
        const sKey = decryptKey(wallet.skey_hash, this.configService.get('PKEY_SECRET'));
        const keypair = Keypair.fromSecretKey(Buffer.from(sKey, 'base64'));
        const messageBytes = nacl_util.decodeUTF8(message);
        const decodedSignature = nacl_util.decodeBase64(signature);
        const isValid = nacl.sign.detached.verify(messageBytes, decodedSignature, keypair.secretKey);
        return isValid;
    }
}
