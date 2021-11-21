import { Controller, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from 'grpc';

import { SettingsServiceController, LoadProfilePayload, LoadProfileResponse, ChangeProfilePayload, ChangeProfileResponse} from 'types/settings';
import { settingsService } from './settings.service';

@Controller()
export class SettingsController implements SettingsServiceController {
  
  constructor(
    private readonly settingsService: settingsService,
    @Inject(JwtService) private readonly jwtService: JwtService
  ){}
  
  @GrpcMethod('SettingsService', 'loadProfile')
  async loadProfile(request: LoadProfilePayload): Promise<LoadProfileResponse> {
    const { userid } = request;
    const profile = await this.settingsService.loadProfile(userid);

    return {
      bgColor: profile.bgColor,
      fontSize: profile.fontSize,
      waschanged: profile.waschanged,
    }
  }

  @GrpcMethod('SettingsService', 'changeProfile')
  async changeProfile(request: ChangeProfilePayload, metadata: Metadata): Promise<ChangeProfileResponse> {
    const authorization = metadata.get('authorization')[0] as string;
    const [, token] = authorization.split('Bearer ');
    const { usr } = this.jwtService.decode(token) as {
      usr: string;
      iat: number;
      exp: number;
      };

    const { fontSize, bgColor } = request;
    await this.settingsService.changeProfile(usr, bgColor, fontSize);

    return {
      status: 'OK'
    }
  }

}
