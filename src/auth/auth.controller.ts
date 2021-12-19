import { Body, Controller, Inject } from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AuthServiceController, EditPasswordPayload, EditPasswordResponse, EmptyPayload, GetAllNotyficationsResponse, LoginByEmailResponse, LoginByGooglePayload, LoginByGoogleResponse, RegisterByEmailResponse } from 'types/authentication';
import { RegisterUserDto } from '../dto/register-user';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login';
import { Metadata } from 'grpc';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController implements AuthServiceController {

  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    @Inject('RMQ') private readonly rmqClient: ClientProxy,
    @Inject(JwtService) private readonly jwtService: JwtService
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

    // this.rmqClient.emit('createUser', JSON.stringify({
    //   id: user.id,
    //   email: user.email
    // }));

    this.logger.log('New user was created');

    return {
      status: 'OK'
    }
  }


  @GrpcMethod('AuthService', 'editPassword')
  async editPassword(payload: EditPasswordPayload): Promise<EditPasswordResponse> {
    const { email, password } = payload;
    await this.authService.changePassword(email, password);

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

  @GrpcMethod('AuthService', 'getAllNotifications')
  async getAllNotifications(_request: EmptyPayload, metadata: Metadata): Promise<GetAllNotyficationsResponse> {
    const authorization = metadata.get('authorization')[0] as string;
    const [, token] = authorization.split('Bearer ');
    const { usr } = this.jwtService.decode(token) as {
      usr: string;
      iat: number;
      exp: number;
      };
    
    const user = await this.authService.loadUser(usr);
    
    var notifications: [string]

    if (user && user.notifications) {
      notifications = user.notifications
    }

    return {
      notyfications: notifications
    }
  }
}
