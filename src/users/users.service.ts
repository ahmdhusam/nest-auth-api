import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { HashService } from '../common/services/hash.service';

export type UserSignUpData = Pick<User, 'email' | 'firstName' | 'lastName' | 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async create({ password, ...restUserData }: UserSignUpData): Promise<User> {
    const existingUser = await this.userModel.exists({ email: restUserData.email }).exec();
    if (existingUser) {
      throw new BadRequestException('User registration failed');
    }

    const hashedPassword = await this.hashService.hash(password);

    const newUser = new this.userModel({
      ...restUserData,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async findOneBy(where: Partial<Pick<User, '_id' | 'email'>>): Promise<User | null> {
    return this.userModel.findOne({ ...where }).exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }
}
