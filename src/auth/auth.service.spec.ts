import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../users/users.model';
import { AuthUserDto } from '../dto/auth-user.dto';
import * as bcrypt from 'bcryptjs';
import { HttpException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
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

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });


  describe('login', () => {
    it('Должен бросить UnauthorizedException, если пароль неверный', async () => {
      const authUserDto: AuthUserDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const user: User = {
        id: 10,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 5),
        refreshToken: 'valid-refresh-token',
        avatar: 'path-to-avatar.jpg',
        events: [],
      } as any;

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(authUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('Должен бросить UnauthorizedException, если пользователь не найден', async () => {
      const authUserDto: AuthUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      await expect(authService.login(authUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registration', () => {
    
    it('Должен бросить HttpException с кодом HttpStatus.BAD_REQUEST, если пользователь существует', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: User = {
        id: 10,
        email: createUserDto.email,
        password: await bcrypt.hash('password', 5),
        refreshToken: 'valid-refresh-token',
        avatar: 'path-to-avatar.jpg',
        events: [],
      } as any;

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(user);
  
      await expect(authService.registration(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('refreshAccessToken', () => {
    it('Должен успешно обновить access_token и вернуть его', async () => {
      const refreshToken = 'valid-refresh-token';
      const userId = 1;
      
      const user: User = {
        id: userId,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 5),
        refreshToken: refreshToken,
        avatar: 'path-to-avatar.jpg',
        events: [],
      } as any;
    
      const expectedAccess = { access_token: 'access-token' };
    
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      
      jest.spyOn(jwtService, 'sign').mockReturnValue('access-token');
    
      const result = await authService.refreshAccessToken(refreshToken, userId);
    
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          refreshToken: refreshToken,
          id: userId,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, id: userId });
      expect(result).toEqual(expectedAccess);
    });
  });
});
