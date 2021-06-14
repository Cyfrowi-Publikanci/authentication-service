import { Body, Controller, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { Logger } from 'nestjs-pino';

import { SettingsServiceController, LoadProfilePayload, LoadProfileResponse, ChangeProfilePayload, ChangeProfileResponse} from 'types/settings';
import { settingsService } from './settings.service';

@Controller()
export class SettingsController implements SettingsServiceController {
  
  constructor(
    private readonly settingsService: settingsService,
    private readonly logger: Logger,
    @Inject(JwtService) private readonly jwtService: JwtService
  ){}
  
  @GrpcMethod('SettingsService', 'loadProfile')
  async loadProfile(any: LoadProfilePayload): Promise<LoadProfileResponse> {
    const { userid } = any;
    const user = await this.settingsService.loadProfile(userid);

    return {
      preferences: user.preferences,
      userid: user.id,
      waschanged: user.waschanged,
    }
  }

  @GrpcMethod('SettingsService', 'changeProfile')
  async changeProfile(any: ChangeProfilePayload, metadata: Metadata): Promise<ChangeProfileResponse> {
    const authorization = metadata.get('authorization')[0] as string;
    const [, token] = authorization.split('Bearer ');
    const { usr } = this.jwtService.decode(token) as {
      usr: string;
      iat: number;
      exp: number;
      };
    this.logger.log(usr);
    const { preferences } = any;
    this.logger.log("PREFERENCES BEFORE PASSING INTO FUNCTION =>" + preferences);
    this.logger.log("usr BEFORE PASSING INTO FUNCTION =>" + usr);
    const user = await this.settingsService.changeProfile(usr, preferences);

    return {
      status: 'OK'
    }
  }

}
