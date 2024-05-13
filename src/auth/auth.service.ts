import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/model/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('user does not exist! ');
    }
    if (!this.comparePassword(password, user.password)) {
      throw new UnauthorizedException('Password is not correct!');
    }
    return user;
  }

  async getHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(pass, hashedPass) {
    bcrypt.compare(pass, hashedPass).then((isMateched) => {
      return isMateched ? true : false;
    });
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: {
        name: user.firstname + ' ' + user.lastname,
      },
    };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: {
        name: user.firstname + ' ' + user.lastname,
      },
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
