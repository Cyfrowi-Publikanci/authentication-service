import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from 'grpc';

export class InvalidToken extends RpcException {
  constructor() {
    super({
      code: GrpcStatus.UNKNOWN,
      details: 'Invalid token'
    });
  }
}