import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

export const config = () => ({
  serviceHostname: process.env.SERVICE_HOSTNAME,
  servicePort: process.env.SERVICE_PORT,
  database: {
    authDatabaseName: process.env.SERVICE_AUTH_DATABASE_NAME,
    authDatabaseConnection: process.env.SERVICE_AUTH_DATABASE_URI,
  },
  jwt: {
    jwtExpiresInSeconds: process.env.JWT_EXPIRES_IN_SECONDS,
    jwtSalt: process.env.JWT_SALT,
    jwtSaltRounds: process.env.JWT_SALT_ROUNDS,
  }
});

type TConfig = ReturnType<typeof config>;

@Injectable()
export class ConfigService extends NestConfigService<TConfig> {
  constructor() {
    super(config());
  }

  get<T extends keyof TConfig>(propertyPath: T): TConfig[T] | undefined {
    return super.get(propertyPath);
  }
}
