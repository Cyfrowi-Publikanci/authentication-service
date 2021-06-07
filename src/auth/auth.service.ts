import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserAlreadyExist } from 'src/errors/user-already-exist';
import { UserNotPresent } from 'src/errors/user-not-present';
import { User, UserDocument } from 'src/schemas/user.schema';
import { SessionService } from 'src/session/session.service';
import { ConfigService } from '@app/config';
import { IncorrectPassword } from 'src/errors/incorrect-password';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly sessionService: SessionService,
    private readonly config: ConfigService,
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
    const newUser = this.userModel.create({ email, password: passwordHash });

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
}
