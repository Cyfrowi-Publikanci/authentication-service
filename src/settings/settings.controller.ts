import { Body, Controller, Inject } from '@nestjs/common';
import { ClientProxy, GrpcMethod } from '@nestjs/microservices';

import { SettingsServiceController, LoadProfilePayload, LoadProfileResponse, ChangeProfilePayload, ChangeProfileResponse} from 'types/settings';
import { settingsService } from './settings.service';

@Controller()
export class SettingsController implements SettingsServiceController {
  
  constructor(
    private readonly settingsService: settingsService,
    @Inject('RMQ') private readonly rmqClient: ClientProxy
  ){}
  
  @GrpcMethod('SettingsService', 'loadProfile')
  async loadProfile(any: LoadProfilePayload): Promise<LoadProfileResponse> {
    console.log(any)
    const { userid } = any;
    const user = await this.settingsService.loadProfile(userid);

    return {
      preferences: 'OK',
      userid: 'OK'
    }
  }

  @GrpcMethod('SettingsService', 'changeProfile')
  async changeProfile(any: ChangeProfilePayload): Promise<ChangeProfileResponse> {
    console.log(any)
    const { userid, preferences } = any;
    const user = await this.settingsService.changeProfile(userid, preferences);


    return {
      userid: 'OK'
    }
  }

}
