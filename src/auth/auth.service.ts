import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: AuthUserDto) {
        const user = await this.validateUser(userDto);
        
        const access_token = await this.generateAccessToken(user);
        const refresh_token = await this.generateRefreshToken(user);

        const refresh_token_value = refresh_token.refresh_token;

        user.refreshToken = refresh_token_value;
        await user.save({ fields: ['refreshToken']});
        
        return [access_token, refresh_token];
    }

    async registration(userDto: CreateUserDto, avatar?: Express.Multer.File) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
      
        if (avatar) {
          user.avatar = `uploads/${avatar.filename}`;
          await user.save({fields: ['avatar']});
        }

        const access_token = await this.generateAccessToken(user);
        const refresh_token = await this.generateRefreshToken(user);

        const refresh_token_value = refresh_token.refresh_token;

        

        user.refreshToken = refresh_token_value;
        await user.save({ fields: ['refreshToken']});

        return [access_token, refresh_token];
    }

    async generateAccessToken(user: User) {
        const payload = {email: user.email, id: user.id};
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async generateRefreshToken(user: User) {
        const payload = {email: user.email, id: user.id};
        return {
           refresh_token: this.jwtService.sign(payload, {expiresIn: '7d'})
        }
    }

    private async validateUser(userDto: AuthUserDto) {
      const user = await this.userService.getUserByEmail(userDto.email);
      
      if (!user) {
        throw new UnauthorizedException({message: 'Пользователь с таким email не найден'})
      }

      const passwordEquals = await bcrypt.compare(userDto.password, user.password);

      if (!passwordEquals) {
        throw new UnauthorizedException({message: 'Некорректный пароль'})
      }

      return user;
    }

    async refreshAccessToken(refreshToken: string, userId: number) {
      const user = await User.findOne({
        where: {
          refreshToken: refreshToken,
          id: userId,
        },
      });

      if (!user) {
        throw new Error('Неверный refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      
      return accessToken;

    }

}
