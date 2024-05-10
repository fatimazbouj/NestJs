import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { UserService } from '../user/user.service';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
    });
    this.logger = new Logger(JwtStrategy.name);
  }

  async validate(payload) {
    this.logger.log('Validate passport:', payload);

    return this.userService.findOne({ email: payload.email });
  }
}
