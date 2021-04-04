import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  
  async getAllUsers(): Promise<string> {
    return 'Hello pub lab'
  }
}
