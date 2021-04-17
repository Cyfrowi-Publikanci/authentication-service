import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Session, SessionSchema } from 'src/schemas/session.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ConfigModule, ConfigService } from '@app/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ 
        secret: configService.get('jwt').jwtSalt,
        signOptions: { algorithm: 'HS256' }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService]
})
export class SessionModule {}