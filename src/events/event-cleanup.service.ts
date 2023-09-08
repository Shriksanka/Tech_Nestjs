import { Injectable } from "@nestjs/common";
import { EventsService } from "./events.service";
import { Cron } from "@nestjs/schedule";


@Injectable()
export class EventCleanupService {
    constructor(private readonly eventService: EventsService) {}

    @Cron('0 0 * * * MON')
    async cleanupOldEvents() {
    const currentDate = new Date();
    await this.eventService.deleteOldEvents(currentDate);

    }
}
