import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {SequelizeModule} from "@nestjs/sequelize";
import {TestModule} from "./modules/test.module";
import {Test} from "./models/test.model";
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { Event } from './events/events.model';
import { AuthMiddleware } from './auth/auth.middleware';
import { SecurityInterceptor } from './auth/security.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';


@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [Test, User, Event],
            autoLoadModels: true
        }),
        TestModule,
        UsersModule,
        AuthModule,
        EventsModule,
    ],
    providers: [{
        provide: APP_INTERCEPTOR,
        useClass: SecurityInterceptor
    }]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                {path: '/auth/login', method: RequestMethod.POST},
                {path: '/auth/registration', method: RequestMethod.POST},
                {path: '/auth/refresh-token', method: RequestMethod.POST}
            )
            .forRoutes('*');
    }
}
