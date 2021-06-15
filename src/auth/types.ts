import { User } from "src/schemas/user.schema";

export interface UserWithGoogle {
  id: string;
  email: string;
  verifiedEmail: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  locale?: string;
  hd?: string;
}

export interface GooglePayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string;
}

export namespace GooglePayload {
  export function toUser(payload: GooglePayload): User {
    return {
      password: '',
      googleId: payload.sub,
      email: payload.email,
      verifiedEmail: payload.email_verified,
      name: payload.name,
      givenName: payload.given_name,
      familyName: payload.family_name,
      picture: payload.picture,
      locale: payload.locale,
      hd: payload.hd,
    };
  }
}
