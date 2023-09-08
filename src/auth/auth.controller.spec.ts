import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../dto/refersh-token.dto';
import { CreateUserDto } from '../dto/create-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            registration: jest.fn(),
            refreshAccessToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('Должен вызывать authService.login с правильными данными и возвращать валидные токены', async () => {
      const authUserDto: AuthUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedTokens = {
        access_token: 'valid-access-token',
        refresh_token: 'valid-refresh-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue([expectedTokens]);

      const result = await authController.login(authUserDto);

      expect(authService.login).toHaveBeenCalledWith(authUserDto);
      expect(result).toEqual([expectedTokens]);
    });

    it('Должен вызывать UnauthorizedException с неправильными данными', async () => {
      const invalidAuthUserDto: AuthUserDto = {
        email: 'invalid-email',
        password: 'invalid-password',
      };

      jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException());

      try {
        await authController.login(invalidAuthUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('Должен вызывать BadRequestException с невалидными данными', async () => {
      const invalidAuthUserDto: AuthUserDto = {
        email: 'invalid-email',
        password: 'short',
      };

      jest.spyOn(authService, 'login').mockRejectedValue(new BadRequestException());

      try {
        await authController.login(invalidAuthUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('registration', () => {
    it('Должен возвращать валидные данные такие как access token и refresh token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedTokens = {
        access_token: 'valid-access-token',
        refresh_token: 'valid-refresh-token',
      };

      jest.spyOn(authService, 'registration').mockResolvedValue([expectedTokens]);

      const result = await authController.registration(createUserDto);

      expect(result).toEqual([expectedTokens]);
    });

    it('Должен вызывать BadRequestException с невалидными данными', async () => {
      const invalidCreateUserDto: CreateUserDto = {
        email: 'invalid-email',
        password: 'short',
      };

      jest.spyOn(authService, 'registration').mockRejectedValue(new BadRequestException());

      try {
        await authController.registration(invalidCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    
  });

  describe('refreshAccessToken', () => {
    it('Должен вызывать authService.refreshAccessToken с правильными данными и возвращать валидный access token', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        userId: 1,
        refreshToken: 'valid-refresh-token',
      };

      const userId = refreshTokenDto.userId;
      const refreshToken = refreshTokenDto.refreshToken;

      const expectedAccessToken = {
        access_token: 'valid-access-token',
      };

      jest.spyOn(authService, 'refreshAccessToken').mockResolvedValue(expectedAccessToken);

      const result = await authController.refreshAccessToken(refreshTokenDto);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken, userId);
      expect(result).toEqual(expectedAccessToken);
    });

    it('Должен вызывать NotFoundException с невалидным refreshToken', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        userId: 1,
        refreshToken: 'invalid-refresh-token',
      };

      jest.spyOn(authService, 'refreshAccessToken').mockRejectedValue(new NotFoundException('Refresh token not found'));

      try {
        await authController.refreshAccessToken(refreshTokenDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Ошибка при обновлении access token');
      }
    });
  });
});
