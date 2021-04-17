import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from 'grpc';

export class LackOfSession extends RpcException {
  constructor() {
    super({
      code: GrpcStatus.UNKNOWN,
      details: 'Lack of session'
    });
  }
}