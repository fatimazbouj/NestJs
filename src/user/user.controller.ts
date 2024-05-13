import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import {
  ConflictException,
  Controller,
  Post,
  Logger,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger(UserController.name);
  }

  @Post('create')
  async createUser(@Request() req): Promise<any> {
    const user = req.body;
    try {
      if (await this.userService.findOne({ email: user.email })) {
        throw new ConflictException('User already exist');
      }
      return await this.userService.create(user);
    } catch (err) {
      this.logger.error('Something went wrong in signup:', err);
      throw err;
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async getUser(@Request() req) {
    return await this.userService.findOne(req.query);
  }
}
