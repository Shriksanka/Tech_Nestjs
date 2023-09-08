import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventOwnershipGuard } from './event-ownership.guard';
import { ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { Event } from './events.model';

class EventStatistic {
    @ApiProperty({example: '2023-09-07', description: 'Дата'})
    date: Date;
    @ApiProperty({example: '2', description: 'Количество'})
    count: number;
}

@ApiTags('События')
@Controller('events')
export class EventsController {

    constructor(private eventService: EventsService) {}

    @ApiOperation({summary: 'Создание события'})
    @ApiResponse({status: 200, type: Event})
    @Post('/create')
    create(@Body() dto: CreateEventDto, @Req() req) {
        return this.eventService.createEvent(dto, req.user.id);
    }

    @ApiOperation({summary: 'Загрузка события по его id'})
    @ApiResponse({status: 200, type: Event})
    @Get('/get/:id')
    @UseGuards(EventOwnershipGuard)
    get(@Param('id') id: string) {
        return this.eventService.getEventById(+id);
    }

    @ApiOperation({summary: 'Изминение события по его id'})
    @ApiResponse({status: 200, type: Event})
    @Patch('/update/:id')
    @UseGuards(EventOwnershipGuard)
    update(@Param('id') id: string, @Body() UpdateEventDto: UpdateEventDto) {
        return this.eventService.updateEvent(+id, UpdateEventDto);
    }

    @ApiOperation({summary: 'Удаление события по его id'})
    @ApiResponse({status: 200, type: String})
    @Delete('/delete/:id')
    @UseGuards(EventOwnershipGuard)
    delete(@Param('id') id: string) {
        return this.eventService.deleteEvent(+id);
    }

    @ApiOperation({summary: 'Получить все события пользователя, для данного метода надо указать страницу и лимит'})
    @ApiResponse({status: 200, type: [Event]})
    @Get('/getall')
    async getAll(@Req() req, @Query('page') page: number, @Query('limit') limit: number) {
        const userId = req.user.id;
        const events = await this.eventService.getAllUserEvents(userId, page, limit);
        return events;
    }

    @ApiOperation({summary: 'Получить статистику событий пользователя, как период мы используем: week, month, year'})
    @ApiResponse({status: 200, type: [EventStatistic]})
    @ApiParam({ name: 'period', description: 'Период (week, month, year)', enum: ['week', 'month', 'year']})
    @Get('/statistics/:period')
    getStatics(@Req() req, @Param('period') period: 'week' | 'month' | 'year') {
        return this.eventService.getUserEventStatistics(req.user.id, period);
    }
}
