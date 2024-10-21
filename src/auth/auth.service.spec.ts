import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../common/services/hash.service';
import { TokenService } from './providers/token.service';
import { BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let hashService: HashService;
  let tokenService: TokenService;

  const mockUser = {
    id: 'userId',
    email: 'test@gmail.com',
    firstName: 'firstName',
    lastName: 'lastName',
    password: 'hashedPassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOneBy: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateTokens: jest.fn(),
            isRefreshTokenValid: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    hashService = module.get<HashService>(HashService);
    tokenService = module.get<TokenService>(TokenService);
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const signUpDto = {
        email: 'test@gmail.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password123',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authService.signUp(signUpDto);

      expect(result).toEqual({ message: 'User successfully created' });
      expect(usersService.create).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw BadRequestException if user already exists', async () => {
      const signUpDto = {
        email: 'test@gmail.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password123',
      };

      jest.spyOn(usersService, 'create').mockRejectedValue(new BadRequestException('User registration failed'));

      await expect(authService.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUserCredentials', () => {
    it('should return user if credentials are valid', async () => {
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(hashService, 'compare').mockResolvedValue(true);

      const result = await authService.validateUserCredentials('test@gmail.com', 'password123');

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(null);

      await expect(authService.validateUserCredentials('test@gmail.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(hashService, 'compare').mockResolvedValue(false);

      await expect(authService.validateUserCredentials('test@gmail.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('generateAndSaveTokens', () => {
    it('should generate and save tokens', async () => {
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token.with.signature',
      };

      jest.spyOn(tokenService, 'generateTokens').mockResolvedValue(tokens);
      jest.spyOn(hashService, 'hash').mockResolvedValue('hashed-refresh-token-signature');

      const result = await authService.generateAndSaveTokens(mockUser);

      expect(result).toEqual(tokens);
      expect(tokenService.generateTokens).toHaveBeenCalledWith(mockUser.id, mockUser.email);
      expect(hashService.hash).toHaveBeenCalledWith('signature');
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(mockUser.id, 'hashed-refresh-token-signature');
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens if refresh token is valid', async () => {
      const oldRefreshToken = 'old.refresh.token';
      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new.refresh.token',
      };

      jest.spyOn(tokenService, 'isRefreshTokenValid').mockResolvedValue(true);
      jest.spyOn(authService as any, 'generateAndSaveTokens').mockResolvedValue(newTokens);

      const result = await authService.refreshTokens(mockUser, oldRefreshToken);

      expect(result).toEqual(newTokens);
      expect(tokenService.isRefreshTokenValid).toHaveBeenCalledWith(mockUser, 'token');
      expect(authService['generateAndSaveTokens']).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ForbiddenException if refresh token is invalid', async () => {
      jest.spyOn(tokenService, 'isRefreshTokenValid').mockResolvedValue(false);

      await expect(authService.refreshTokens(mockUser, 'invalid.refresh.token')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should update refresh token to null', async () => {
      await authService.logout('userId');

      expect(usersService.updateRefreshToken).toHaveBeenCalledWith('userId', null);
    });
  });

  describe('extractRefreshTokenSignature', () => {
    it('should extract the signature from a refresh token', () => {
      const refreshToken = 'header.payload.signature';

      const result = (authService as any).extractRefreshTokenSignature(refreshToken);

      expect(result).toBe('signature');
    });
  });
});
