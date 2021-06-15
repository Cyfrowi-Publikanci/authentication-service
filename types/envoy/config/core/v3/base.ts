/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { SemanticVersion } from '../../../../envoy/type/v3/semantic_version';
import { Struct } from '../../../../google/protobuf/struct';
import { HttpUri } from '../../../../envoy/config/core/v3/http_uri';
import { FractionalPercent } from '../../../../envoy/type/v3/percent';
import { Any } from '../../../../google/protobuf/any';

export const protobufPackage = 'envoy.config.core.v3';

/**
 * Envoy supports :ref:`upstream priority routing
 * <arch_overview_http_routing_priority>` both at the route and the virtual
 * cluster level. The current priority implementation uses different connection
 * pool and circuit breaking settings for each priority level. This means that
 * even for HTTP/2 requests, two physical connections will be used to an
 * upstream host. In the future Envoy will likely support true HTTP/2 priority
 * over a single upstream connection.
 */
export enum RoutingPriority {
  DEFAULT = 0,
  HIGH = 1,
  UNRECOGNIZED = -1,
}

/** HTTP request method. */
export enum RequestMethod {
  METHOD_UNSPECIFIED = 0,
  GET = 1,
  HEAD = 2,
  POST = 3,
  PUT = 4,
  DELETE = 5,
  CONNECT = 6,
  OPTIONS = 7,
  TRACE = 8,
  PATCH = 9,
  UNRECOGNIZED = -1,
}

/** Identifies the direction of the traffic relative to the local Envoy. */
export enum TrafficDirection {
  /** UNSPECIFIED - Default option is unspecified. */
  UNSPECIFIED = 0,
  /** INBOUND - The transport is used for incoming traffic. */
  INBOUND = 1,
  /** OUTBOUND - The transport is used for outgoing traffic. */
  OUTBOUND = 2,
  UNRECOGNIZED = -1,
}

/** Identifies location of where either Envoy runs or where upstream hosts run. */
export interface Locality {
  /** Region this :ref:`zone <envoy_api_field_config.core.v3.Locality.zone>` belongs to. */
  region: string;
  /**
   * Defines the local service zone where Envoy is running. Though optional, it
   * should be set if discovery service routing is used and the discovery
   * service exposes :ref:`zone data <envoy_api_field_config.endpoint.v3.LocalityLbEndpoints.locality>`,
   * either in this message or via :option:`--service-zone`. The meaning of zone
   * is context dependent, e.g. `Availability Zone (AZ)
   * <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html>`_
   * on AWS, `Zone <https://cloud.google.com/compute/docs/regions-zones/>`_ on
   * GCP, etc.
   */
  zone: string;
  /**
   * When used for locality of upstream hosts, this field further splits zone
   * into smaller chunks of sub-zones so they can be load balanced
   * independently.
   */
  subZone: string;
}

/**
 * BuildVersion combines SemVer version of extension with free-form build information
 * (i.e. 'alpha', 'private-build') as a set of strings.
 */
export interface BuildVersion {
  /** SemVer version of extension. */
  version?: SemanticVersion;
  /**
   * Free-form build information.
   * Envoy defines several well known keys in the source/common/common/version.h file
   */
  metadata?: Struct;
}

/**
 * Version and identification for an Envoy extension.
 * [#next-free-field: 6]
 */
export interface Extension {
  /**
   * This is the name of the Envoy filter as specified in the Envoy
   * configuration, e.g. envoy.router, com.acme.widget.
   */
  name: string;
  /**
   * Category of the extension.
   * Extension category names use reverse DNS notation. For instance "envoy.filters.listener"
   * for Envoy's built-in listener filters or "com.acme.filters.http" for HTTP filters from
   * acme.com vendor.
   * [#comment:TODO(yanavlasov): Link to the doc with existing envoy category names.]
   */
  category: string;
  /**
   * [#not-implemented-hide:] Type descriptor of extension configuration proto.
   * [#comment:TODO(yanavlasov): Link to the doc with existing configuration protos.]
   * [#comment:TODO(yanavlasov): Add tests when PR #9391 lands.]
   */
  typeDescriptor: string;
  /**
   * The version is a property of the extension and maintained independently
   * of other extensions and the Envoy API.
   * This field is not set when extension did not provide version information.
   */
  version?: BuildVersion;
  /** Indicates that the extension is present but was disabled via dynamic configuration. */
  disabled: boolean;
}

/**
 * Identifies a specific Envoy instance. The node identifier is presented to the
 * management server, which may use this identifier to distinguish per Envoy
 * configuration for serving.
 * [#next-free-field: 11]
 */
export interface Node {
  /**
   * An opaque node identifier for the Envoy node. This also provides the local
   * service node name. It should be set if any of the following features are
   * used: :ref:`statsd <arch_overview_statistics>`, :ref:`CDS
   * <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-node`.
   */
  id: string;
  /**
   * Defines the local service cluster name where Envoy is running. Though
   * optional, it should be set if any of the following features are used:
   * :ref:`statsd <arch_overview_statistics>`, :ref:`health check cluster
   * verification
   * <envoy_api_field_config.core.v3.HealthCheck.HttpHealthCheck.service_name_matcher>`,
   * :ref:`runtime override directory <envoy_api_msg_config.bootstrap.v3.Runtime>`,
   * :ref:`user agent addition
   * <envoy_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.add_user_agent>`,
   * :ref:`HTTP global rate limiting <config_http_filters_rate_limit>`,
   * :ref:`CDS <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-cluster`.
   */
  cluster: string;
  /**
   * Opaque metadata extending the node identifier. Envoy will pass this
   * directly to the management server.
   */
  metadata?: Struct;
  /** Locality specifying where the Envoy instance is running. */
  locality?: Locality;
  /**
   * Free-form string that identifies the entity requesting config.
   * E.g. "envoy" or "grpc"
   */
  userAgentName: string;
  /**
   * Free-form string that identifies the version of the entity requesting config.
   * E.g. "1.12.2" or "abcd1234", or "SpecialEnvoyBuild"
   */
  userAgentVersion: string | undefined;
  /** Structured version of the entity requesting config. */
  userAgentBuildVersion?: BuildVersion | undefined;
  /** List of extensions and their versions supported by the node. */
  extensions: Extension[];
  /**
   * Client feature support list. These are well known features described
   * in the Envoy API repository for a given major version of an API. Client features
   * use reverse DNS naming scheme, for example `com.acme.feature`.
   * See :ref:`the list of features <client_features>` that xDS client may
   * support.
   */
  clientFeatures: string[];
}

/**
 * Metadata provides additional inputs to filters based on matched listeners,
 * filter chains, routes and endpoints. It is structured as a map, usually from
 * filter name (in reverse DNS format) to metadata specific to the filter. Metadata
 * key-values for a filter are merged as connection and request handling occurs,
 * with later values for the same key overriding earlier values.
 *
 * An example use of metadata is providing additional values to
 * http_connection_manager in the envoy.http_connection_manager.access_log
 * namespace.
 *
 * Another example use of metadata is to per service config info in cluster metadata, which may get
 * consumed by multiple filters.
 *
 * For load balancing, Metadata provides a means to subset cluster endpoints.
 * Endpoints have a Metadata object associated and routes contain a Metadata
 * object to match against. There are some well defined metadata used today for
 * this purpose:
 *
 * * ``{"envoy.lb": {"canary": <bool> }}`` This indicates the canary status of an
 *   endpoint and is also used during header processing
 *   (x-envoy-upstream-canary) and for stats purposes.
 * [#next-major-version: move to type/metadata/v2]
 */
export interface Metadata {
  /**
   * Key is the reverse DNS filter name, e.g. com.acme.widget. The envoy.*
   * namespace is reserved for Envoy's built-in filters.
   */
  filterMetadata: { [key: string]: Struct };
}

export interface Metadata_FilterMetadataEntry {
  key: string;
  value?: Struct;
}

/** Runtime derived uint32 with a default when not specified. */
export interface RuntimeUInt32 {
  /** Default value if runtime value is not available. */
  defaultValue: number;
  /** Runtime key to get value for comparison. This value is used if defined. */
  runtimeKey: string;
}

/** Runtime derived bool with a default when not specified. */
export interface RuntimeFeatureFlag {
  /** Default value if runtime value is not available. */
  defaultValue?: boolean;
  /**
   * Runtime key to get value for comparison. This value is used if defined. The boolean value must
   * be represented via its
   * `canonical JSON encoding <https://developers.google.com/protocol-buffers/docs/proto3#json>`_.
   */
  runtimeKey: string;
}

/** Header name/value pair. */
export interface HeaderValue {
  /** Header name. */
  key: string;
  /**
   * Header value.
   *
   * The same :ref:`format specifier <config_access_log_format>` as used for
   * :ref:`HTTP access logging <config_access_log>` applies here, however
   * unknown header values are replaced with the empty string instead of `-`.
   */
  value: string;
}

/** Header name/value pair plus option to control append behavior. */
export interface HeaderValueOption {
  /** Header name/value pair that this option applies to. */
  header?: HeaderValue;
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values.
   */
  append?: boolean;
}

/** Wrapper for a set of headers. */
export interface HeaderMap {
  headers: HeaderValue[];
}

/** Data source consisting of either a file or an inline value. */
export interface DataSource {
  /** Local filesystem data source. */
  filename: string | undefined;
  /** Bytes inlined in the configuration. */
  inlineBytes: Uint8Array | undefined;
  /** String inlined in the configuration. */
  inlineString: string | undefined;
}

/** The message specifies how to fetch data from remote and how to verify it. */
export interface RemoteDataSource {
  /** The HTTP URI to fetch the remote data. */
  httpUri?: HttpUri;
  /** SHA256 string for verifying data. */
  sha256: string;
}

/** Async data source which support async data fetch. */
export interface AsyncDataSource {
  /** Local async data source. */
  local?: DataSource | undefined;
  /** Remote async data source. */
  remote?: RemoteDataSource | undefined;
}

/**
 * Configuration for transport socket in :ref:`listeners <config_listeners>` and
 * :ref:`clusters <envoy_api_msg_config.cluster.v3.Cluster>`. If the configuration is
 * empty, a default transport socket implementation and configuration will be
 * chosen based on the platform and existence of tls_context.
 */
export interface TransportSocket {
  /**
   * The name of the transport socket to instantiate. The name must match a supported transport
   * socket implementation.
   */
  name: string;
  typedConfig?: Any | undefined;
}

/**
 * Generic socket option message. This would be used to set socket options that
 * might not exist in upstream kernels or precompiled Envoy binaries.
 * [#next-free-field: 7]
 */
export interface SocketOption {
  /**
   * An optional name to give this socket option for debugging, etc.
   * Uniqueness is not required and no special meaning is assumed.
   */
  description: string;
  /** Corresponding to the level value passed to setsockopt, such as IPPROTO_TCP */
  level: number;
  /** The numeric name as passed to setsockopt */
  name: number;
  /** Because many sockopts take an int value. */
  intValue: number | undefined;
  /** Otherwise it's a byte buffer. */
  bufValue: Uint8Array | undefined;
  /**
   * The state in which the option will be applied. When used in BindConfig
   * STATE_PREBIND is currently the only valid value.
   */
  state: SocketOption_SocketState;
}

export enum SocketOption_SocketState {
  /** STATE_PREBIND - Socket options are applied after socket creation but before binding the socket to a port */
  STATE_PREBIND = 0,
  /** STATE_BOUND - Socket options are applied after binding the socket to a port but before calling listen() */
  STATE_BOUND = 1,
  /** STATE_LISTENING - Socket options are applied after calling listen() */
  STATE_LISTENING = 2,
  UNRECOGNIZED = -1,
}

/**
 * Runtime derived FractionalPercent with defaults for when the numerator or denominator is not
 * specified via a runtime key.
 *
 * .. note::
 *
 *   Parsing of the runtime key's data is implemented such that it may be represented as a
 *   :ref:`FractionalPercent <envoy_api_msg_type.v3.FractionalPercent>` proto represented as JSON/YAML
 *   and may also be represented as an integer with the assumption that the value is an integral
 *   percentage out of 100. For instance, a runtime key lookup returning the value "42" would parse
 *   as a `FractionalPercent` whose numerator is 42 and denominator is HUNDRED.
 */
export interface RuntimeFractionalPercent {
  /** Default value if the runtime value's for the numerator/denominator keys are not available. */
  defaultValue?: FractionalPercent;
  /** Runtime key for a YAML representation of a FractionalPercent. */
  runtimeKey: string;
}

/** Identifies a specific ControlPlane instance that Envoy is connected to. */
export interface ControlPlane {
  /**
   * An opaque control plane identifier that uniquely identifies an instance
   * of control plane. This can be used to identify which control plane instance,
   * the Envoy is connected to.
   */
  identifier: string;
}

export const ENVOY_CONFIG_CORE_V3_PACKAGE_NAME = 'envoy.config.core.v3';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
