import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StripeModule } from 'nestjs-stripe';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { SessionModule } from '../session/session.module';
import { config, ConfigModule, ConfigService } from '@app/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SessionModule,
    ConfigModule,
    StripeModule.forRoot({
      apiKey: 'sk_test_51IwuLIH9jl5mtxQfVu7Q6oNiflIvXysjAJDNeVVM3bm9zbpr8RyRwML0rhFxtIbCVQGVCdGAJegM3SaPJzScCXFt00QIqgQ6lR',
      apiVersion: '2020-08-27',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ 
        secret: configService.get('jwt').jwtSalt,
        signOptions: { algorithm: 'HS256' }
      }),
      inject: [ConfigService],
    }),
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
