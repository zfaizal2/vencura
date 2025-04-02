import { SendTransactionDto } from "@repo/api/packages/api/src/wallet/send-transaction.dto";
import { SignMessageDto } from "@repo/api/packages/api/src/wallet/sign-message.dto";
import { CreateUserDto } from "@repo/api/user/dto/create-user.dto";
import { CreateWalletDto } from "@repo/api/wallet/create-wallet.dto";

export class VencuraSdk {
    private baseUrl: string;
    private sessionKey: string;

    constructor(baseUrl: string, sessionKey: string) {
        this.baseUrl = baseUrl;
        this.sessionKey = sessionKey;
    }

    async createUser(user: CreateUserDto) {
        const response = await fetch(`${this.baseUrl}/user`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.sessionKey}`
            }
        });
        return response.json();
    }

    // Wallet Methods
    async createWallet(wallet: CreateWalletDto) {
        const response = await fetch(`${this.baseUrl}/wallet/solana`, {
            method: 'POST',
            body: JSON.stringify(wallet),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.sessionKey}`
            }
        });
        return response.json();
    }

    async getWallet(userAuthId: string) {
        const response = await fetch(`${this.baseUrl}/wallet/solana/${userAuthId}`, {
            headers: {
                'Authorization': `Bearer ${this.sessionKey}`
            }
        });
        return response.json();
    }

    async getWalletBalance(publicKey: string) {
        const response = await fetch(`${this.baseUrl}/wallet/solana/${publicKey}/balance`, {
            headers: {
                'Authorization': `Bearer ${this.sessionKey}`
            }
        });
        return response.json();
    }

    async sendTransaction(transaction: SendTransactionDto) {
        const response = await fetch(`${this.baseUrl}/wallet/solana/sendTransaction`, {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.sessionKey}`
            }
        });
        return response.json();
    }

    async signMessage(signRequest: SignMessageDto) {
        const response = await fetch(`${this.baseUrl}/wallet/solana/signMessage`, {
            method: 'POST',
            body: JSON.stringify(signRequest),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.sessionKey}`
            }
        });
        return response.json();
    }

}