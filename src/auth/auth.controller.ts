import { Body, Controller, Post, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';
import { RefreshTokenDto } from '../dto/refersh-token.dto';

class TokenResponseDto {
    @ApiResponseProperty({type: String})
    access_token?: string;

    @ApiResponseProperty({type: String})
    refresh_token?: string;
}

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Вход пользователя'})
    @ApiResponse({status: 200, type: [TokenResponseDto]})
    @Post('/login')
    login(@Body() userDto: AuthUserDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 200, type: [TokenResponseDto]})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({summary: 'Обновление access token с использованием refresh token'})
    @ApiResponse({status: 200})
    @Post('/refresh-token')
    async refreshAccessToken(@Body() refreshDto: RefreshTokenDto) {
        try {
            const userId = refreshDto.userId;
            const refreshToken = refreshDto.refreshToken;
            const accessToken = await this.authService.refreshAccessToken(refreshToken, userId);
            return accessToken;
        } catch (e) {
            throw new UnauthorizedException('Ошибка при обновлении access token');
        }
    }


    
}
