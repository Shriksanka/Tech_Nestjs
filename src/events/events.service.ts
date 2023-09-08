import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './events.model';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Op } from 'sequelize';

@Injectable()
export class EventsService {

    constructor(@InjectModel(Event) private eventRepository: typeof Event) {}

    async createEvent(dto: CreateEventDto, userId: number) {
        const event = await this.eventRepository.create({...dto, userId});
        return event;
    }

    async isEventOwner(eventId: number, userId:number): Promise<boolean> {
        const event = await this.eventRepository.findByPk(eventId);

        if(!event) {
            throw new UnauthorizedException({message: 'Событие не найдено'})
        }
        
        if (event.userId !== userId) {
            throw new UnauthorizedException({message: 'Пользователь не является автором события'})
        }
        
        return true;
    }

    async getEventById(eventId: number): Promise<Event> {
        const event = await this.eventRepository.findByPk(eventId);
        if(!event) {
            throw new UnauthorizedException({message: 'Событие не найдено'})
        }
        return event;
    }

    async updateEvent(eventId: number, dto: UpdateEventDto): Promise<Event> {
        const event = await this.eventRepository.findByPk(eventId);

        if(!event) {
            throw new UnauthorizedException({message: 'Событие не найдено'})
        }

        for(const key in dto) {
            if (dto[key] !== null && dto[key] !== undefined) {
                event[key] = dto[key];
            }
        }
        await event.save()
        return event;
    }

    async deleteEvent(eventId: number): Promise<string> {
        const event = await this.eventRepository.findByPk(eventId);
        if(!event) {
            throw new UnauthorizedException({message: 'Событие не найдено'})
        }
        await event.destroy();
        return `Событие с ID ${eventId} успешно удалено`;
    }

    async getAllUserEvents(userId: number, page: number, limit: number): Promise<Event[]> {
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0 || limit > 100) {
            throw new BadRequestException('Некорректные параметры пагинации');
        }    
        const offset = (page - 1) * limit;

        return this.eventRepository.findAll({
            where: { userId: userId },
            offset,
            limit,
        });
    }

    async getUserEventStatistics(userId: number, period: 'week' | 'month' | 'year') {
        const currentDate = new Date();
        const startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(currentDate.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(currentDate.getMonth() - 30);
                break;
            case 'year':
                const oneYearAgo = new Date();
                oneYearAgo.setDate(currentDate.getDate() - 365);

                startDate.setDate(oneYearAgo.getDate());
                startDate.setMonth(oneYearAgo.getMonth());
                startDate.setFullYear(oneYearAgo.getFullYear());

                currentDate.setDate(currentDate.getDate());
                break;
            default:
                throw new BadRequestException('Некорректный период');
        }

        const statistics = await this.eventRepository.sequelize.query(`
            SELECT
                to_char(date_series, 'YYYY-MM-DD') AS date,
                COUNT("Event"."id") AS count
            FROM
                generate_series('${startDate.toISOString()}'::timestamp, '${currentDate.toISOString()}'::timestamp, '1 day'::interval) AS date_series
            LEFT JOIN
                "events" AS "Event"
            ON
                to_char("Event"."date_start", 'YYYY-MM-DD') = to_char(date_series, 'YYYY-MM-DD')
            AND
                "Event"."userId" = ${userId}
            GROUP BY
                date_series
            HAVING
                count("Event"."id") > 0
            ORDER BY
                date_series ASC;
        `);

        console.log('Статистика событий:');
        console.log(statistics);

        const formattedStatistics = statistics[0].map((start: any) => ({
            date: start.date,
            count: parseInt(start.count) || 0,
        }));

        return formattedStatistics;
    }

    async deleteOldEvents(currentDate: Date) {
        await this.eventRepository.destroy({
            where: {
                date_end: { [Op.lte]: currentDate },
            },
        });
    }
    
}
