import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './model/user.model';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  logger: Logger;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async findOne(query: any): Promise<any> {
    return await this.userModel.findOne(query).select('+password');
  }

  async create(user: any): Promise<any> {
    if (!user) {
      throw new NotFoundException('User not valid!');
    }
    const hashPassword = await this.authService.getHashedPassword(
      user.password,
    );
    user.password = hashPassword;
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
