import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { status as GrpcStatus } from 'grpc';

import { AppModule } from './app.module';
import { config } from '@app/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: true,
  });

  const logger = app.get(Logger);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${config().rabbitMQ.name}:${config().rabbitMQ.port}`],
      queue: 'cats_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['envoy.service.auth.v3', 'authentication', 'settings'],
      url: `${config().serviceHostname}:${config().servicePort}`,
      protoPath: [
        path.resolve('proto/envoy/service/auth/v3/external_auth.proto'),
        path.resolve('proto/authentication.proto'),
        path.resolve('proto/settings.proto'),
      ],
      loader: {
        includeDirs: [path.resolve('proto')],
      },
    }
  });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { target: false, value: false },
      exceptionFactory: errors =>
        new RpcException({
          code: GrpcStatus.INVALID_ARGUMENT,
          details: JSON.stringify(errors.map(error => error.property))
        })
    })
  );
  
  app.useLogger(logger);

  try {
    await app.startAllMicroservicesAsync();
  } catch (error) {
    Logger.error(error.stack);
  }
}
bootstrap();
