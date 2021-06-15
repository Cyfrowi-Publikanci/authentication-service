import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from 'grpc';

export class IncorrectPassword extends RpcException {
  constructor() {
    super({
      code: GrpcStatus.UNKNOWN,
      details: 'Incorrect password'
    });
  }
}