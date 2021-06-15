/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { Duration } from '../../../../google/protobuf/duration';

export const protobufPackage = 'envoy.config.core.v3';

/** Envoy external URI descriptor */
export interface HttpUri {
  /**
   * The HTTP server URI. It should be a full FQDN with protocol, host and path.
   *
   * Example:
   *
   * .. code-block:: yaml
   *
   *    uri: https://www.googleapis.com/oauth2/v1/certs
   */
  uri: string;
  /**
   * A cluster is created in the Envoy "cluster_manager" config
   * section. This field specifies the cluster name.
   *
   * Example:
   *
   * .. code-block:: yaml
   *
   *    cluster: jwks_cluster
   */
  cluster: string | undefined;
  /** Sets the maximum duration in milliseconds that a response can take to arrive upon request. */
  timeout?: Duration;
}

export const ENVOY_CONFIG_CORE_V3_PACKAGE_NAME = 'envoy.config.core.v3';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
