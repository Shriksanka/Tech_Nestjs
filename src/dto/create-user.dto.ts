import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, Length, IsOptional } from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: 'user@example.com', description: 'Почтовый адрес'})
    @IsString({message: 'Должно быть строкой. Пример: user@example.com'})
    @IsEmail({}, {message: 'Некорректный email. Пример: user@example.com'})
    @IsNotEmpty({message: 'Не может быть пустым полем'})
    readonly email: string;
    
    @ApiProperty({example: '12345', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой. Пример: 12345'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;

    @ApiProperty({ example: 'path-to-avatar.jpg', description: 'Путь к аватару пользователя', required: false })
    @IsString({ message: 'Должно быть строкой. Пример: path-to-avatar.jpg' })
    @IsOptional()
    readonly avatar?: string;
}