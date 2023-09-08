import { Test, TestingModule } from '@nestjs/testing';
import { EventCleanupService } from './event-cleanup.service';
import { EventsService } from './events.service';

describe('EventCleanupService', () => {
  let eventCleanupService: EventCleanupService;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventCleanupService,
        {
          provide: EventsService,
          useValue: {
            deleteOldEvents: jest.fn(),
          },
        },
      ],
    }).compile();

    eventCleanupService = module.get<EventCleanupService>(EventCleanupService);
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should clean up old events once a week', async () => {
    const currentDate = new Date();
    const deleteOldEventsSpy = jest.spyOn(eventsService, 'deleteOldEvents');

    await eventCleanupService.cleanupOldEvents();

    expect(deleteOldEventsSpy).toHaveBeenCalledWith(currentDate);
  });
});
