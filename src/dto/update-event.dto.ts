import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";

export class UpdateEventDto {
    @ApiProperty({example: 'Отпуск', description: 'Название события'})
    @IsString({message: 'Название события должно быть строкой. Пример: Отпуск'})
    name: string | null;
    
    @ApiProperty({example: '2023-09-06T14:00:00Z', description: 'Дата начала события'})
    @IsDateString({}, {message: 'Неверный формат даты начала события. Пример: 2023-09-05T14:00:00Z'})
    date_start: Date | null;
    
    @ApiProperty({example: '2023-09-07T14:00:00Z', description: 'Дата конца события'})
    @IsDateString({}, {message: 'Неверный формат даты конца события. Пример: 2023-09-06T14:00:00Z'})
    date_end: Date | null;
}