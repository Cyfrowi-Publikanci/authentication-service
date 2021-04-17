import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { SessionModule } from 'src/session/session.module';
import { ConfigModule } from '@app/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SessionModule,
    ConfigModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
