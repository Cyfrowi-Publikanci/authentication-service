import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from 'grpc';

export class UserNotPresent extends RpcException {
  constructor() {
    super({
      code: GrpcStatus.UNKNOWN,
      details: 'User not present'
    });
  }
}