import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { LoginDto } from '../dto/login';
import { AuthController } from './auth.controller';
import { Session } from '../schemas/session.schema';
import { User } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../dto/register-user';
import { UserDocument } from '../schemas/user.schema';

describe('AuthController', () => {
  let authController: AuthController;

  const sessionModelMock = class {};
  const userModelMock = class {};

  const authServiceMock = {
    login: jest.fn(),
    createAccount: jest.fn()
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([{ name: 'RMQ' }])],
      controllers: [AuthController],
      providers: [AuthService, Logger]
    })
      .overrideProvider(getModelToken(Session.name))
      .useValue(sessionModelMock)
      .overrideProvider(getModelToken(User.name))
      .useValue(userModelMock)
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('AuthController', () => {
    describe('loginByEmail', () => {
      it('should return token', async () => {
        authServiceMock.login = jest.fn().mockReturnValue('test');
        const loginDto = new LoginDto();

        expect(await authController.loginByEmail(loginDto)).toEqual({ token: 'test' })
      });
    });

    describe('registerByEmail', () => {
      it('should return status', async () => {
        authServiceMock.createAccount = jest.fn().mockReturnValue({ id: '1', email: 'a@a.com' } as UserDocument);
        const registerUserDto = new RegisterUserDto();

        expect(await authController.registerByEmail(registerUserDto)).toEqual({ status: 'OK' })
      });
    });
  });
});
