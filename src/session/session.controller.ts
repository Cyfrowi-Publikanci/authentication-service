import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { InvalidToken } from '../errors/invalid-token';
import { AuthorizationController, CheckRequest, CheckResponse } from 'types/envoy/service/auth/v3/external_auth';
import { SessionService } from './session.service';

@Controller()
export class SessionController implements AuthorizationController {
  constructor(
    private readonly sessionService: SessionService
  ){}

  @GrpcMethod('Authorization', 'Check')
  async check(request: CheckRequest): Promise<CheckResponse> {
    
    if (typeof request?.attributes?.request?.http?.headers?.authorization !== 'string') {
      throw new InvalidToken();
    }

    const [, token] = request.attributes.request.http.headers.authorization.split('Bearer ');

    await this.sessionService.validate(token);

    return {
      status: {
        code: 0,
        message: 'OK',
        details: []
      }
    }
  }
}
