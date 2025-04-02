import { Injectable } from '@nestjs/common';
import { DynamicStrategy } from '@dynamic-labs/passport-dynamic';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  private dynamicStrategy: DynamicStrategy;

  constructor(private configService: ConfigService) {
    const publicKey = this.configService.get<string>('DYNAMIC_JWT_PUBLIC_KEY');

    this.dynamicStrategy = new DynamicStrategy(
      { publicKey },
      async (payload, done) => {
        return done(null, payload);
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
