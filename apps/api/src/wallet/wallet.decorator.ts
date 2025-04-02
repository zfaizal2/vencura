import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const Owner = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        request.owner = data;
        return data;
    },
);