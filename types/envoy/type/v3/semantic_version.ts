/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'envoy.type.v3';

/**
 * Envoy uses SemVer (https://semver.org/). Major/minor versions indicate
 * expected behaviors and APIs, the patch version field is used only
 * for security fixes and can be generally ignored.
 */
export interface SemanticVersion {
  majorNumber: number;
  minorNumber: number;
  patch: number;
}

export const ENVOY_TYPE_V3_PACKAGE_NAME = 'envoy.type.v3';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
