import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

import { config } from 'config/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ['authentication'],
      url: `${config().serviceHostname}:${config().servicePort}`,
      protoPath: path.resolve('proto/authentication.proto'),
    }
  });

  app.listen(() => console.log(`Microservice ${config().serviceHostname} is listening on port ${config().servicePort}`));
}
bootstrap();
