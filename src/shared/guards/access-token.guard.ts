// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AccessTokenGuard extends AuthGuard('jwt') {
//   constructor(private reflector: Reflector) {
//     super();
//   }

//   // canActivate(context: ExecutionContext) {
//   //   const isPublic = this.reflector.getAllAndOverride('isPublic', [
//   //     context.getHandler(),
//   //     context.getClass(),
//   //   ]);

//   //   if (isPublic) return true;

//   //   return super.canActivate(context);
//   // }
// }

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import AppError from '../utils/app-error.utils';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw new AppError('0005', 'Access token is missing or invalid.');
    }
    return user;
  }
}
