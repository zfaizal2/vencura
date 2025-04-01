import { Injectable } from '@nestjs/common';
import { DynamicStrategy } from '@dynamic-labs/passport-dynamic';
import { ConfigService } from '@nestjs/config';

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
    try {
      return new Promise((resolve, reject) => {
        this.dynamicStrategy.verify(token, (err: any, payload: any) => {
          if (err) {
            resolve(false);
          }
          resolve(true);
        });
      });
    } catch (error) {
      return false;
    }
  }
}
