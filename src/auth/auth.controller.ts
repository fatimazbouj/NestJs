import { RefreshJwtJwtGuard } from './guards/refresh-jwt-auth';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalStrategy)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.body);
  }

  @UseGuards(RefreshJwtJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
