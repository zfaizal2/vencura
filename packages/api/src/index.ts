import { Link } from 'links/entities/link.entity';

import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { CreateUserDto } from 'user/dto/create-user.dto';
import { CreateWalletDto } from 'wallet/create-wallet.dto';
import { SendTransactionDto } from 'wallet/send-transaction.dto';
import { SignMessageDto } from 'wallet/sign-message.dto';

export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
    CreateUserDto,
    CreateWalletDto,
    SendTransactionDto, 
    SignMessageDto,
  },
  entities: {
    Link,
  },
};

export * from '../../../apps/api/src/utils';