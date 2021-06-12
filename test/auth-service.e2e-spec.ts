import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as ProtoLoader from '@grpc/proto-loader';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import {
  ServiceClient,
  ServiceClientConstructor,
} from '@grpc/grpc-js/build/src/make-client';
import { resolve } from 'path';

import { LoginByEmailPayload, LoginByEmailResponse } from 'types/authentication';
import { AppModule } from '../src/app.module';

describe('AuthService (e2e)', () => {
  let module: TestingModule;
  let app: INestMicroservice;
  let client: ServiceClient;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const url = 'localhost:5000';
    app = module.createNestMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url,
        package: ['authentication'],
        protoPath: [
          resolve(__dirname, '../proto/authentication.proto'),
        ],
      },
    });
    await app.listenAsync()

    const proto = await ProtoLoader.load(resolve(__dirname, '../proto/authentication.proto'));
    const protoGrpc = loadPackageDefinition(proto) as {
      authentication: {
        AuthService: ServiceClientConstructor;
      };
    };


    client = new protoGrpc.authentication.AuthService(
      url,
      credentials.createInsecure(),
    );
  });

  it('should login user', async () => {
    await new Promise<void>((resolve) => {
      const payload: LoginByEmailPayload = { email: 'a@a.com', password: '123456K@k' };
  
      client.loginByEmail(payload, (err: Error, _response: LoginByEmailResponse) => {
        expect(err).toBeNull();
        resolve();
      });
    });
  });

  it('should receive error "incorrect password"', async () => {
    await new Promise<void>((resolve) => {
      const payload: LoginByEmailPayload = { email: 'a@a.com', password: '123456K@' };
  
      client.loginByEmail(payload, (err: Error, _response: LoginByEmailResponse) => {
        expect(err.message).toEqual('2 UNKNOWN: Incorrect password');
        resolve();
      });
    });
  });

  it('should receive error "user not present"', async () => {
    await new Promise<void>((resolve) => {
      const payload: LoginByEmailPayload = { email: 'test', password: '123456K@' };
  
      client.loginByEmail(payload, (err: Error, _response: LoginByEmailResponse) => {
        expect(err.message).toEqual('2 UNKNOWN: User not present');
        resolve();
      });
    });
  });

  afterAll(async () => {
    await app.close();
    client.close();
  });
});
