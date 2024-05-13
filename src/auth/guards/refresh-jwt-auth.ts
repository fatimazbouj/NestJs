import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtJwtGuard extends AuthGuard('jwt-refresh') {}
