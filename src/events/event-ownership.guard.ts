import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { EventsService } from "./events.service";
import { Observable } from "rxjs";


@Injectable()
export class EventOwnershipGuard implements CanActivate {
    constructor(private readonly eventsService: EventsService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const eventId = +request.params.id;
        const userId = request.user.id;

        const isOwner = this.eventsService.isEventOwner(eventId, userId);

        return isOwner;
    }
} 