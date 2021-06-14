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

export interface LoginByEmailPayload {
  email: string;
  password: string;
}

export interface LoginByEmailResponse {
  token: string;
}

export interface RegisterByEmailPayload {
  email: string;
  password: string;
}

export interface RegisterByEmailResponse {
  status: string;
}

export interface EditPasswordResponse {
  email: string;
  password: string;
}

export interface EditPasswordPayload {
  email: string;
  password: string;
}

export interface LoginByGooglePayload {
  token: string;
}

export interface LoginByGoogleResponse {
  token: string;
}

export interface BuyPremiumPayload {
  card: string;
  cvc: string;
  month: string;
  year: string;
}

export interface BuyPremiumResponse {
  paymentStatus: string;
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

export interface AuthServiceClient {
  loginByEmail(
    request: LoginByEmailPayload,
    metadata?: Metadata,
  ): Observable<LoginByEmailResponse>;

  registerByEmail(
    request: RegisterByEmailPayload,
    metadata?: Metadata,
  ): Observable<RegisterByEmailResponse>;

  editPassword(
    request: EditPasswordPayload,
    metadata?: Metadata,
  ): Observable<EditPasswordResponse>;

  loginByGoogle(
    request: LoginByGooglePayload,
    metadata?: Metadata,
  ): Observable<LoginByGoogleResponse>;

  buyPremium(
    request: BuyPremiumPayload,
    metadata?: Metadata,
  ): Observable<BuyPremiumResponse>;
}

export interface AuthServiceController {
  loginByEmail(
    request: LoginByEmailPayload,
    metadata?: Metadata,
  ):
    | Promise<LoginByEmailResponse>
    | Observable<LoginByEmailResponse>
    | LoginByEmailResponse;

  registerByEmail(
    request: RegisterByEmailPayload,
    metadata?: Metadata,
  ):
    | Promise<RegisterByEmailResponse>
    | Observable<RegisterByEmailResponse>
    | RegisterByEmailResponse;

  editPassword(
    request: EditPasswordPayload,
    metadata?: Metadata,
  ):
    | Promise<EditPasswordResponse>
    | Observable<EditPasswordResponse>
    | EditPasswordResponse;

  loginByGoogle(
    request: LoginByGooglePayload,
    metadata?: Metadata,
  ):
    | Promise<LoginByGoogleResponse>
    | Observable<LoginByGoogleResponse>
    | LoginByGoogleResponse;

  buyPremium(
    request: BuyPremiumPayload,
    metadata?: Metadata,
  ):
    | Promise<BuyPremiumResponse>
    | Observable<BuyPremiumResponse>
    | BuyPremiumResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'loginByEmail',
      'registerByEmail',
      'editPassword',
      'loginByGoogle',
      'buyPremium',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AuthService', method)(
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
      GrpcStreamMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
