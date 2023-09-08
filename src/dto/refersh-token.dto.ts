import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RefreshTokenDto {
   
  @ApiProperty({example: '1', description: 'UserId - id пользователя'})
  @IsInt({message: 'UserId должен быть числом. Пример: 1'})
  userId: number;

  @ApiProperty({example: 'eyJhbGciOiJIUz...SzHJvvChDZyE', description: 'Refresh_token пользователя'})
  @IsString({message: 'RefreshToken должен быть строкой: eyJhbGciOiJIUz...SzHJvvChDZyE'})
  refreshToken: string;
}
