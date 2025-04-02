import { Wallet } from "../../wallet/entities/wallet.entities";
export class User {
    id: string;
    name: string;
    email: string;
    auth_method: string;
    auth_id: string;
    created_at: Date;
    updated_at: Date;
    wallets: Wallet[];
}