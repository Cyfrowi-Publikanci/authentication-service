import { Body, Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { AuthServiceController, LoginByEmailResponse, RegisterByEmailResponse } from 'types/authentication';
import { RegisterUserDto } from 'src/dto/register-user';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login';

@Controller()
export class AuthController implements AuthServiceController {
  
  constructor(
    private readonly authService: AuthService
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
    
    await this.authService.createAccount(email, password);
    
    return {
      status: 'OK'
    }
  }
}
