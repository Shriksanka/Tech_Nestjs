import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "../users/users.model";


interface EventCreationAttrs {
    name: string;
    date_start: Date;
    date_end: Date;
    userId: number;
}

@Table({tableName: 'events'})
export class Event extends Model<Event, EventCreationAttrs>{
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @ApiProperty({example: 'Отпуск', description: 'Название данного события'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '2023-09-06T14:00:00Z', description: 'Дата и время начала данного события, создает автоматически дату и время начала, как дату и время создания - в случае не ввода даты начала'})
    @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
    date_start: Date;

    @ApiProperty({example: '2023-09-07T12:00:00Z', description: 'Дата и время окончания данного события'})
    @Column({type: DataType.DATE, allowNull: false})
    date_end: Date;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)
    author: User;
}