import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
export const encryptKey = (key: string, secret: string) => {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', secret, iv);
    let encrypted = cipher.update(key, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
};

export const decryptKey = (encrypted: string, secret: string) => {
    const parts = encrypted.split(':');
    if (parts.length !== 2) {
        throw new Error('Invalid encrypted string format');
    }
    const [ivBase64, encryptedKey] = parts;
    if (!ivBase64 || !encryptedKey) {
        throw new Error('Invalid encrypted string format');
    }
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = createDecipheriv('aes-256-cbc', secret, iv);
    let decrypted = decipher.update(encryptedKey, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export * from './solana';