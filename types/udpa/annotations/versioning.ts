/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'udpa.annotations';

export interface VersioningAnnotation {
  /**
   * Track the previous message type. E.g. this message might be
   * udpa.foo.v3alpha.Foo and it was previously udpa.bar.v2.Bar. This
   * information is consumed by UDPA via proto descriptors.
   */
  previousMessageType: string;
}

export const UDPA_ANNOTATIONS_PACKAGE_NAME = 'udpa.annotations';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
