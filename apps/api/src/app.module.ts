import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [LinksModule, WalletModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
