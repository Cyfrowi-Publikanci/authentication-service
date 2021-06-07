import { Body, Controller, Inject } from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { AuthServiceController, EditPasswordPayload, EditPasswordResponse, LoginByEmailResponse, RegisterByEmailResponse } from 'types/authentication';
import { RegisterUserDto } from 'src/dto/register-user';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login';

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

  @GrpcMethod('AuthService', 'editPassword')
  async editPassword(any: EditPasswordPayload): Promise<EditPasswordResponse> {
    console.log(any)
    const { email, password } = any;
    const user = await this.authService.changePassword(email, password);

    this.rmqClient.emit('UpdatePassword', JSON.stringify({
      id: user.id,
      email: user.email
    }));

    return {
      email: 'OK'
    }
  }

}
