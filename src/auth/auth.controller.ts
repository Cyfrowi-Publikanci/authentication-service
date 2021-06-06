import { Body, Controller, Inject } from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { AuthServiceController, LoginByEmailResponse, LoginByGooglePayload, LoginByGoogleResponse, RegisterByEmailResponse } from 'types/authentication';
import { RegisterUserDto } from '../dto/register-user';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login';

@Controller()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    @Inject('RMQ') private readonly rmqClient: ClientProxy
  ){}

  @GrpcMethod('AuthService', 'loginByEmail')
  async loginByEmail(@Body() loginDto: LoginDto): Promise<LoginByEmailResponse> {
    const { email, password } = loginDto;
    const token = await this.authService.login(email, password);

    return {
      token
    }
  }

  @GrpcMethod('AuthService', 'registerByEmail')
  async registerByEmail(@Body() registerUserDto: RegisterUserDto): Promise<RegisterByEmailResponse> {
    const { email, password } = registerUserDto;
    
    const user = await this.authService.createAccount(email, password);

    this.rmqClient.emit('createUser', JSON.stringify({
      id: user.id,
      email: user.email
    }));

    this.logger.log('New user was created');
    return {
      status: 'OK'
    }
  }


  @GrpcMethod('AuthService', 'loginByGoogle')
  async loginByGoogle(payload: LoginByGooglePayload): Promise<LoginByGoogleResponse> {

    const token = await this.authService.loginByGoogle(payload);
    return {
      token
    }
  }
}
