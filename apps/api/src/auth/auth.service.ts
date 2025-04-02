import { Injectable } from '@nestjs/common';
import { DynamicStrategy } from '@dynamic-labs/passport-dynamic';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, decode } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  private dynamicStrategy: DynamicStrategy;

  constructor(private configService: ConfigService) {
    const publicKey = this.configService.get<string>('DYNAMIC_JWT_PUBLIC_KEY');

    this.dynamicStrategy = new DynamicStrategy(
      { publicKey },
      async (payload, done) => {
        const decodedPayload = decode(payload as string);
        return done(null, decodedPayload);
      },
    );
  }

  async verifyToken(token: string) {
    return new Promise<JwtPayload>((resolve, reject) => {
      this.dynamicStrategy.verify(token, (err: any, payload: any) => {
        if (err) {
          return reject(false);
        }
        return resolve(payload);
      });
    });
  }
}
