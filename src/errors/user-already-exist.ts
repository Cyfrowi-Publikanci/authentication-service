import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from 'grpc';

export class UserAlreadyExist extends RpcException {
  constructor() {
    super({
      code: GrpcStatus.UNKNOWN,
      details: 'User already exist'
    });
  }
}