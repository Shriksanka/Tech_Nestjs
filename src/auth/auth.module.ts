import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET',
      signOptions: {
        expiresIn: '15m'
      }
    }),
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})

export class AuthModule {}
