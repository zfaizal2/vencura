import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '@repo/api/user/dto/create-user.dto';
import { DEFAULT_AUTH_METHOD } from 'src/consts';

export const AuthId = createParamDecorator<User>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authId = request.userAuthId;
    return authId;
  },
);

export const AuthEmail = createParamDecorator<User>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authEmail = request.email;
    return authEmail;
  },
);