import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { settingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { UserSettings, SettingsSchema } from 'src/schemas/settings.schema';
import { SessionModule } from 'src/session/session.module';
import { config, ConfigModule } from '@app/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSettings.name, schema: SettingsSchema }]),
    SessionModule,
    ConfigModule,
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
