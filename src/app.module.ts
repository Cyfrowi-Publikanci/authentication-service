import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from 'config/configuration';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
})
export class AppModule {}
