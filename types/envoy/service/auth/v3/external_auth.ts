/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { AttributeContext } from '../../../../envoy/service/auth/v3/attribute_context';
import { HttpStatus } from '../../../../envoy/type/v3/http_status';
import { Status } from '../../../../google/rpc/status';
import { Observable } from 'rxjs';
import { HeaderValueOption } from '../../../../envoy/config/core/v3/base';
import { Metadata } from 'grpc';

export const protobufPackage = 'envoy.service.auth.v3';

export interface CheckRequest {
  /** The request attributes. */
  attributes?: AttributeContext;
}

/** HTTP attributes for a denied response. */
export interface DeniedHttpResponse {
  /**
   * This field allows the authorization service to send a HTTP response status
   * code to the downstream client other than 403 (Forbidden).
   */
  status?: HttpStatus;
  /**
   * This field allows the authorization service to send HTTP response headers
   * to the downstream client.
   */
  headers: HeaderValueOption[];
  /**
   * This field allows the authorization service to send a response body data
   * to the downstream client.
   */
  body: string;
}

/** HTTP attributes for an ok response. */
export interface OkHttpResponse {
  /**
   * HTTP entity headers in addition to the original request headers. This allows the authorization
   * service to append, to add or to override headers from the original request before
   * dispatching it to the upstream. By setting `append` field to `true` in the `HeaderValueOption`,
   * the filter will append the correspondent header value to the matched request header. Note that
   * by Leaving `append` as false, the filter will either add a new header, or override an existing
   * one if there is a match.
   */
  headers: HeaderValueOption[];
}

/** Intended for gRPC and Network Authorization servers `only`. */
export interface CheckResponse {
  /** Status `OK` allows the request. Any other status indicates the request should be denied. */
  status?: Status;
  /** Supplies http attributes for a denied response. */
  deniedResponse?: DeniedHttpResponse | undefined;
  /** Supplies http attributes for an ok response. */
  okResponse?: OkHttpResponse | undefined;
}

export const ENVOY_SERVICE_AUTH_V3_PACKAGE_NAME = 'envoy.service.auth.v3';

/**
 * A generic interface for performing authorization check on incoming
 * requests to a networked service.
 */

export interface AuthorizationClient {
  /**
   * Performs authorization check based on the attributes associated with the
   * incoming request, and returns status `OK` or not `OK`.
   */

  check(request: CheckRequest, metadata?: Metadata): Observable<CheckResponse>;
}

/**
 * A generic interface for performing authorization check on incoming
 * requests to a networked service.
 */

export interface AuthorizationController {
  /**
   * Performs authorization check based on the attributes associated with the
   * incoming request, and returns status `OK` or not `OK`.
   */

  check(
    request: CheckRequest,
    metadata?: Metadata,
  ): Promise<CheckResponse> | Observable<CheckResponse> | CheckResponse;
}

export function AuthorizationControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['check'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('Authorization', method)(
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
      GrpcStreamMethod('Authorization', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTHORIZATION_SERVICE_NAME = 'Authorization';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
