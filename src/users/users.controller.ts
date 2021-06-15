import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GetAllUsersResponse, UsersServiceController } from 'types/authentication';
import { UsersService } from './users.service';

@Controller()
export class UsersController implements UsersServiceController {

  constructor(
    private readonly usersService: UsersService
  ){}
  
  @GrpcMethod('UsersService', 'getAllUsers')
  async getAllUsers(): Promise<GetAllUsersResponse> {
    const response = await this.usersService.getAllUsers();

    return {
      email: response
    }
  }
}
