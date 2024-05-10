import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any) {
    console.log(user, '---------');
    console.log(err, '---------');
    if (err) {
      throw new HttpException(err.message, err.status);
    }
    if (!user) {
      throw new NotFoundException(err);
    }
    return user;
  }
}
