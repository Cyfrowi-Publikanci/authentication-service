import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserNotPresent } from '../errors/user-not-present';
import { UserSettings, SettingsDocument } from '../schemas/settings.schema';

@Injectable()
export class settingsService {

  constructor(
    @InjectModel(UserSettings.name) private readonly SettingsModel: Model<SettingsDocument>,
  ) {}

  async loadProfile(userid: string): Promise<SettingsDocument> {
    const user = await this.SettingsModel.findOne( {userid} );
    if (!user) throw new UserNotPresent();

    return user;
  }

  async changeProfile(userid: string, bgColor: string, fontSize: string): Promise<SettingsDocument> {
    const user = await this.SettingsModel.findOne({ userid });
    if (!user) throw new UserNotPresent();
    const changed = this.SettingsModel.findByIdAndUpdate(user._id, { "$set":{bgColor : bgColor, fontSize: fontSize, waschanged : true}});

    return changed;
  }
}
