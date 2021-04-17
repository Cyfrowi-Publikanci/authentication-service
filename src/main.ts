import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import { status as GrpcStatus } from 'grpc';

import { AppModule } from './app.module';
import { config } from '@app/config/config.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ['envoy.service.auth.v3', 'authentication'],
      url: `${config().serviceHostname}:${config().servicePort}`,
      protoPath: [
        path.resolve('proto/envoy/service/auth/v3/external_auth.proto'),
        path.resolve('proto/authentication.proto'),
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
    
  app.listen(() => console.log(`Microservice ${config().serviceHostname} is listening on port ${config().servicePort}`));
}
bootstrap();
