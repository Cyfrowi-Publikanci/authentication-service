import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { SessionModule } from './session/session.module';
import { ConfigModule, ConfigService } from '@app/config';

@Module({
  imports: [
    LoggerModule.forRoot(),
    NestConfigModule.forRoot({
      isGlobal: true
    }),
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ 
        uri: configService.get('database').authDatabaseConnection,
        connectionName: configService.get('database').authDatabaseName,
        useCreateIndex: true,
        useNewUrlParser: true
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SessionModule,
    SettingsModule,
  ],
})
export class AppModule {}
