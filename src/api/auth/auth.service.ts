import { UserService } from './../user/user.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getHashedPassword(password: string): Promise<string> {
    // start from 4 to 31 (the computational complexity of the hashing algorithm)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(email, pass, '-----');
    const query = { email: email };
    const user = await this.userService.findOne(query);
    if (!user) throw new NotFoundException('Email does not exist');
    const isMached = this.comparePassword(pass, user.pass);
    if (!isMached) throw new UnauthorizedException('Password is not valid!');
    return user;
  }

  async comparePassword(pass: string, hashedPass: string): Promise<any> {
    return bcrypt.compare(pass, hashedPass).then((isMatched) => {
      return isMatched ? true : false;
    });
  }

  async generateJwtToken(user: any) {
    const payload = {
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
