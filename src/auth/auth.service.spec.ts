import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, Logger } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { AuthController } from './auth.controller';
import { Session } from '../schemas/session.schema';
import { User } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@app/config';
import { SessionModule } from '../session/session.module';
import { UserNotPresent } from '../errors/user-not-present';
import { IncorrectPassword } from '../errors/incorrect-password';
import { SessionService } from '../session/session.service';

describe('AuthService', () => {
  let authService: AuthService;

  const config = {
    jwt: {
      jwtExpiresInSeconds: 10,
      jwtSalt: 'salt',
      jwtSaltRounds: 10,
    },
  };

  const sessionModelMock = class {};

  const userModelMock = class {
    static save = jest.fn();

    static findOne = jest.fn();

    static findOneAndUpdate = jest.fn();

    static findById = jest.fn();

    static markModified = jest.fn();

    static createCollection = jest.fn();
  };

  const sessionServiceMock = {
    create: jest.fn()
  };

  const configServiceMock = {
    get: jest.fn().mockImplementation(key => config[key]),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        SessionModule,
        ConfigModule,
        HttpModule,
        ClientsModule.register([{ name: 'RMQ' }])
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        Logger,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ]
    })
      .overrideProvider(getModelToken(Session.name))
      .useValue(sessionModelMock)
      .overrideProvider(getModelToken(User.name))
      .useValue(userModelMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('AuthService', () => {
    describe('login', () => {
      it('should throw UserNotPresent', async () => {
        await expect(authService.login('email', 'password')).rejects.toThrow(
          new UserNotPresent()
        );  
      });

      it('should throw IncorrectPassword', async () => {
        userModelMock.findOne = jest.fn().mockReturnValue({ password: '123' });

        await expect(authService.login('email', 'password')).rejects.toThrow(
          new IncorrectPassword()
        );  
      });

      it('should login successfully', async () => {
        const passwordHash = await bcrypt.hash('123', config.jwt.jwtSaltRounds);
        userModelMock.findOne = jest.fn().mockReturnValue({ password: passwordHash });
        sessionServiceMock.create = jest.fn().mockReturnValue('token');

        await expect(authService.login('email', '123')).resolves.toEqual('token');
      });
    });
  });
});
