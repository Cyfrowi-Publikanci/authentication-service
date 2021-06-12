import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';


import { UserNotPresent } from 'src/errors/user-not-present';
import { UserSettings, SettingsDocument } from 'src/schemas/settings.schema';
import { SessionService } from 'src/session/session.service';
import { ConfigService } from '@app/config';


@Injectable()
export class settingsService {

  constructor(
    @InjectModel(UserSettings.name) private readonly SettingsModel: Model<SettingsDocument>,
    private readonly sessionService: SessionService,
    private readonly config: ConfigService,
  ) {}

  async loadProfile(userid: string): Promise<SettingsDocument> {
    //const id = new Types.ObjectId(userid)
    const user = await this.SettingsModel.findOne( {userid} );
    if (!user) throw new UserNotPresent();

    return user;
  }

  async changeProfile(userid: string, preferences: string): Promise<SettingsDocument> {
    const user = await this.SettingsModel.findOne({ userid });
    if (!user) throw new UserNotPresent();

    const changed = this.SettingsModel.findByIdAndUpdate(user.id, {preferences : preferences });

    return changed;
  }
}
