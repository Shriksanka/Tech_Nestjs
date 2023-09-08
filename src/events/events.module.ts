import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './events.model';
import { User } from '../users/users.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  imports: [
    SequelizeModule.forFeature([User, Event]),
    AuthModule,
    JwtModule
  ]
})
export class EventsModule {}
