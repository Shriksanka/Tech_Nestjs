import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthUserDto {
    @ApiProperty({example: 'user@example.com', description: 'Почтовый адрес'})
    @IsString({message: 'Должно быть строкой. Пример: user@example.com'})
    @IsEmail({}, {message: 'Некорректный email. Пример: user@example.com'})
    @IsNotEmpty({message: 'Не может быть пустым полем'})
    readonly email: string;
    
    @ApiProperty({example: '12345', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой. Пример: 12345'})
    @Length(4, 6, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;
}