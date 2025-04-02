import { Link } from 'links/entities/link.entity';

import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { CreateUserDto } from 'user/dto/create-user.dto';
export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
    CreateUserDto,
  },
  entities: {
    Link,
  },
};
