/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';

export const protobufPackage = 'settings';

export interface EmptyPayload {}

export interface LoadProfileResponse {
  bgColor: string;
  fontSize: string;
  waschanged: boolean;
}

export interface LoadProfilePayload {
  userid: string;
}

export interface ChangeProfileResponse {
  status: string;
}

export interface ChangeProfilePayload {
  bgColor: string;
  fontSize: string;
  waschanged: boolean;
}

export const SETTINGS_PACKAGE_NAME = 'settings';

export interface SettingsServiceClient {
  loadProfile(
    request: LoadProfilePayload,
    metadata?: Metadata,
  ): Observable<LoadProfileResponse>;

  changeProfile(
    request: ChangeProfilePayload,
    metadata?: Metadata,
  ): Observable<ChangeProfileResponse>;
}

export interface SettingsServiceController {
  loadProfile(
    request: LoadProfilePayload,
    metadata?: Metadata,
  ):
    | Promise<LoadProfileResponse>
    | Observable<LoadProfileResponse>
    | LoadProfileResponse;

  changeProfile(
    request: ChangeProfilePayload,
    metadata?: Metadata,
  ):
    | Promise<ChangeProfileResponse>
    | Observable<ChangeProfileResponse>
    | ChangeProfileResponse;
}

export function SettingsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['loadProfile', 'changeProfile'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('SettingsService', method)(
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
      GrpcStreamMethod('SettingsService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const SETTINGS_SERVICE_NAME = 'SettingsService';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
