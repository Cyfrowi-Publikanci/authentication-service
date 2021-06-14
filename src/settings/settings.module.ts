import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { settingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { UserSettings, SettingsSchema } from '../schemas/settings.schema';
import { SessionModule } from '../session/session.module';
import { config, ConfigModule, ConfigService } from '@app/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSettings.name, schema: SettingsSchema }]),
    SessionModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ 
        secret: configService.get('jwt').jwtSalt,
        signOptions: { algorithm: 'HS256' }
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'RMQ',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${config().rabbitMQ.name}:${config().rabbitMQ.port}`],
          queue: 'cats_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  providers: [settingsService],
  controllers: [SettingsController]
})
export class SettingsModule {}
