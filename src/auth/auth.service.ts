import * as bcrypt from 'bcrypt';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserAlreadyExist } from '../errors/user-already-exist';
import { UserNotPresent } from '../errors/user-not-present';
import { User, UserDocument } from '../schemas/user.schema';
import { SessionService } from '../session/session.service';
import { UserSettings, SettingsDocument } from '../schemas/settings.schema';
import { ConfigService } from '@app/config';
import { IncorrectPassword } from '../errors/incorrect-password';
import { LoginByGooglePayload } from 'types/authentication';
import { GooglePayload } from './types';
import { LoginFailed } from '../errors/login-failed';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserSettings.name) private readonly settingsModel: Model<SettingsDocument>,
    private readonly logger: Logger,
    private readonly sessionService: SessionService,
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new UserNotPresent();

    const { password: passwordHash } = user;

    if (!bcrypt.compareSync(password, passwordHash)) throw new IncorrectPassword();
    
    const token = await this.sessionService.create(user.id);

    return token;
  }
  
  async createAccount(email: string, password: string): Promise<UserDocument> {
    const maybeUser = await this.userModel.findOne({ email });
    const salt = parseInt(this.config.get('jwt').jwtSaltRounds);

    if (maybeUser) throw new UserAlreadyExist();

    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await this.userModel.create({ email, password: passwordHash });
    if (newUser) this.settingsModel.create({ userid: newUser.id, bgColor: 'blue', fontSize: '12px', waschanged: false }); 
    return newUser;
  }

  async changePassword(email: string, newPassword: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    const salt = parseInt(this.config.get('jwt').jwtSaltRounds);

    if (!user) throw new UserNotPresent();
    const newpassword =  await bcrypt.hash(newPassword, salt);
    const changed = this.userModel.findByIdAndUpdate(user.id, {password : newpassword });

    return changed;
  }
  
  async loginByGoogle(payload: LoginByGooglePayload): Promise<string> {
    const { token } = payload;
    const googleUser = await this.getUserFromSocial(token);
    if (!googleUser.email) throw new LoginFailed();

    let user = await this.userModel.findOne({ 'googleId': googleUser.googleId });

    if (!user) {
      user = await this.userModel.create(googleUser);
    }

    const authToken = await this.sessionService.create(user.id);

    return authToken;
  }

  private async getUserFromSocial(token: string): Promise<User> {
    try {
      const { data: user } = await this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).toPromise();
      return GooglePayload.toUser(user);
    } catch (error) {
      throw new LoginFailed();
    }
  }
}
