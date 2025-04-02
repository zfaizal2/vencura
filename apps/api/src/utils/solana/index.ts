
import { Keypair } from '@solana/web3.js';

export const generateSolanaWallet = (): { publicKey: string; secretKey: string } => {
  const keypair = Keypair.generate();
  
  return {
    publicKey: keypair.publicKey.toString(),
    secretKey: Buffer.from(keypair.secretKey).toString('base64')
  };
};

