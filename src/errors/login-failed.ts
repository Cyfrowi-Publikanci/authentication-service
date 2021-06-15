import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from 'grpc';

export class LoginFailed extends RpcException {
  constructor() {
    super({
      code: GrpcStatus.UNKNOWN,
      details: 'Login failed'
    });
  }
}