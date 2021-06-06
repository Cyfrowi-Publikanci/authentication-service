import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserAlreadyExist } from '../errors/user-already-exist';
import { UserNotPresent } from '../errors/user-not-present';
import { User, UserDocument } from '../schemas/user.schema';
import { SessionService } from '../session/session.service';
import { ConfigService } from '@app/config';
import { IncorrectPassword } from '../errors/incorrect-password';

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
}
