import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
    
    @ApiProperty({example: 'Отпуск', description: 'Название события'})
    @IsString({message: 'Должно быть строкой. Пример: Отпуск'})
    @IsNotEmpty({message: 'Название события обязательно'})
    readonly name: string;
    
    @ApiProperty({example: '2023-09-06T14:00:00Z', description: 'Дата начала события, также тут позволительно не добавлять данный элемент при создании события -> В этом случае дата и время будут поставлены автоматически(дата и время то же, что время и дата создания данного ивента)'})
    @IsOptional()
    @IsDateString({}, {message: 'Неверный формат даты начала события. Пример: 2023-09-05T14:00:00Z'})
    readonly date_start: Date | null;
    
    @ApiProperty({example: '2023-09-07T14:00:00Z', description: 'Дата конца события'})
    @IsDateString({}, {message: 'Не верный формат даты конца события. Пример: 2023-09-06T14:00:00Z'})
    @IsNotEmpty({message: 'Дата конца события обязательна'})
    readonly date_end: Date;
    
    @ApiProperty({example: '1', description: 'Поле userId создается автоматически и не требует ввода от пользователя'})
    readonly userId: number;

    constructor(partial: Partial<CreateEventDto>) {
        Object.assign(this, partial);
    }
}