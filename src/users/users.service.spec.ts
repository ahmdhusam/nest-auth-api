import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HashService } from 'src/common/services/hash.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>;

  const mockUser = {
    _id: 'userId',
    email: 'test@gmail.com',
    firstName: 'firstName',
    lastName: 'lastName',
    password: 'hashedPassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue({
              ...mockUser,
              save: jest.fn().mockResolvedValue(mockUser),
            }),
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exists: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn().mockResolvedValue('hashedPassword'),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('findOneBy', () => {
    it('should find a user by email', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await usersService.findOneBy({ email: 'test@gmail.com' });

      expect(result).toEqual(mockUser);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@gmail.com' });
    });

    it('should find a user by id', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await usersService.findOneBy({ _id: 'userId' });

      expect(result).toEqual(mockUser);
      expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'userId' });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await usersService.findOneBy({ email: 'notfound@gmail.com' });

      expect(result).toBeNull();
    });
  });

  describe('updateRefreshToken', () => {
    it('should update user refresh token', async () => {
      const userId = 'userId';
      const refreshToken = 'new-refresh-token';

      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

      await usersService.updateRefreshToken(userId, refreshToken);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, { refreshToken });
    });
  });
});
