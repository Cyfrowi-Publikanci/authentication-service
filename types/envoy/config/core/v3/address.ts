/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';
import { SocketOption } from '../../../../envoy/config/core/v3/base';

export const protobufPackage = 'envoy.config.core.v3';

export interface Pipe {
  /**
   * Unix Domain Socket path. On Linux, paths starting with '@' will use the
   * abstract namespace. The starting '@' is replaced by a null byte by Envoy.
   * Paths starting with '@' will result in an error in environments other than
   * Linux.
   */
  path: string;
  /** The mode for the Pipe. Not applicable for abstract sockets. */
  mode: number;
}

/** [#next-free-field: 7] */
export interface SocketAddress {
  protocol: SocketAddress_Protocol;
  /**
   * The address for this socket. :ref:`Listeners <config_listeners>` will bind
   * to the address. An empty address is not allowed. Specify ``0.0.0.0`` or ``::``
   * to bind to any address. [#comment:TODO(zuercher) reinstate when implemented:
   * It is possible to distinguish a Listener address via the prefix/suffix matching
   * in :ref:`FilterChainMatch <envoy_api_msg_config.listener.v3.FilterChainMatch>`.] When used
   * within an upstream :ref:`BindConfig <envoy_api_msg_config.core.v3.BindConfig>`, the address
   * controls the source address of outbound connections. For :ref:`clusters
   * <envoy_api_msg_config.cluster.v3.Cluster>`, the cluster type determines whether the
   * address must be an IP (*STATIC* or *EDS* clusters) or a hostname resolved by DNS
   * (*STRICT_DNS* or *LOGICAL_DNS* clusters). Address resolution can be customized
   * via :ref:`resolver_name <envoy_api_field_config.core.v3.SocketAddress.resolver_name>`.
   */
  address: string;
  portValue: number | undefined;
  /**
   * This is only valid if :ref:`resolver_name
   * <envoy_api_field_config.core.v3.SocketAddress.resolver_name>` is specified below and the
   * named resolver is capable of named port resolution.
   */
  namedPort: string | undefined;
  /**
   * The name of the custom resolver. This must have been registered with Envoy. If
   * this is empty, a context dependent default applies. If the address is a concrete
   * IP address, no resolution will occur. If address is a hostname this
   * should be set for resolution other than DNS. Specifying a custom resolver with
   * *STRICT_DNS* or *LOGICAL_DNS* will generate an error at runtime.
   */
  resolverName: string;
  /**
   * When binding to an IPv6 address above, this enables `IPv4 compatibility
   * <https://tools.ietf.org/html/rfc3493#page-11>`_. Binding to ``::`` will
   * allow both IPv4 and IPv6 connections, with peer IPv4 addresses mapped into
   * IPv6 space as ``::FFFF:<IPv4-address>``.
   */
  ipv4Compat: boolean;
}

export enum SocketAddress_Protocol {
  TCP = 0,
  UDP = 1,
  UNRECOGNIZED = -1,
}

export interface TcpKeepalive {
  /**
   * Maximum number of keepalive probes to send without response before deciding
   * the connection is dead. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 9.)
   */
  keepaliveProbes?: number;
  /**
   * The number of seconds a connection needs to be idle before keep-alive probes
   * start being sent. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 7200s (ie 2 hours.)
   */
  keepaliveTime?: number;
  /**
   * The number of seconds between keep-alive probes. Default is to use the OS
   * level configuration (unless overridden, Linux defaults to 75s.)
   */
  keepaliveInterval?: number;
}

export interface BindConfig {
  /** The address to bind to when creating a socket. */
  sourceAddress?: SocketAddress;
  /**
   * Whether to set the *IP_FREEBIND* option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_api_field_config.cluster.v3.UpstreamBindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option *IP_FREEBIND* is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  freebind?: boolean;
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  socketOptions: SocketOption[];
}

/**
 * Addresses specify either a logical or physical address and port, which are
 * used to tell Envoy where to bind/listen, connect to upstream and find
 * management servers.
 */
export interface Address {
  socketAddress?: SocketAddress | undefined;
  pipe?: Pipe | undefined;
}

/**
 * CidrRange specifies an IP Address and a prefix length to construct
 * the subnet mask for a `CIDR <https://tools.ietf.org/html/rfc4632>`_ range.
 */
export interface CidrRange {
  /** IPv4 or IPv6 address, e.g. ``192.0.0.0`` or ``2001:db8::``. */
  addressPrefix: string;
  /** Length of prefix, e.g. 0, 32. */
  prefixLen?: number;
}

export const ENVOY_CONFIG_CORE_V3_PACKAGE_NAME = 'envoy.config.core.v3';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
