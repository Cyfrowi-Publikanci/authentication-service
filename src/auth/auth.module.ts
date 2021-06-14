import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { UserSettings, SettingsSchema } from '../schemas/settings.schema';
import { SessionModule } from '../session/session.module';
import { config, ConfigModule } from '@app/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: UserSettings.name, schema: SettingsSchema }]),
    SessionModule,
    ConfigModule,
    HttpModule,
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
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
