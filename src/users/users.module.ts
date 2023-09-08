import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { AuthModule } from '../auth/auth.module';
import { Event } from '../events/events.model';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Event]),
    forwardRef(() => AuthModule)
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule {}
