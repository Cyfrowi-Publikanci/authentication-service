/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';

export const protobufPackage = 'authentication';

export interface EmptyPayload {}

export interface GetAllUsersResponse {
  email: string;
}

export const AUTHENTICATION_PACKAGE_NAME = 'authentication';

export interface UsersServiceClient {
  getAllUsers(
    request: EmptyPayload,
    metadata?: Metadata,
  ): Observable<GetAllUsersResponse>;
}

export interface UsersServiceController {
  getAllUsers(
    request: EmptyPayload,
    metadata?: Metadata,
  ):
    | Promise<GetAllUsersResponse>
    | Observable<GetAllUsersResponse>
    | GetAllUsersResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getAllUsers'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UsersService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UsersService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USERS_SERVICE_NAME = 'UsersService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
