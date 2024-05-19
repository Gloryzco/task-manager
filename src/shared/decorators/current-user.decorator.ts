import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interfaces';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;
    return user.sub;
  },
);

// export const GetCurrentUser = createParamDecorator(
//   (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     if (!data) return request.user;
//     return request.user[data];
//   },
// );
