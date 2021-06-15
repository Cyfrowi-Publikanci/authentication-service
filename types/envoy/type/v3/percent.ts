/* eslint-disable */
import { util, configure } from 'protobufjs/minimal';
import * as Long from 'long';

export const protobufPackage = 'envoy.type.v3';

/** Identifies a percentage, in the range [0.0, 100.0]. */
export interface Percent {
  value: number;
}

/**
 * A fractional percentage is used in cases in which for performance reasons performing floating
 * point to integer conversions during randomness calculations is undesirable. The message includes
 * both a numerator and denominator that together determine the final fractional value.
 *
 * * **Example**: 1/100 = 1%.
 * * **Example**: 3/10000 = 0.03%.
 */
export interface FractionalPercent {
  /** Specifies the numerator. Defaults to 0. */
  numerator: number;
  /**
   * Specifies the denominator. If the denominator specified is less than the numerator, the final
   * fractional percentage is capped at 1 (100%).
   */
  denominator: FractionalPercent_DenominatorType;
}

/** Fraction percentages support several fixed denominator values. */
export enum FractionalPercent_DenominatorType {
  /**
   * HUNDRED - 100.
   *
   * **Example**: 1/100 = 1%.
   */
  HUNDRED = 0,
  /**
   * TEN_THOUSAND - 10,000.
   *
   * **Example**: 1/10000 = 0.01%.
   */
  TEN_THOUSAND = 1,
  /**
   * MILLION - 1,000,000.
   *
   * **Example**: 1/1000000 = 0.0001%.
   */
  MILLION = 2,
  UNRECOGNIZED = -1,
}

export const ENVOY_TYPE_V3_PACKAGE_NAME = 'envoy.type.v3';

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
