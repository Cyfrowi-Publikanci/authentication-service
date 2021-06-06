import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from '../schemas/user.schema';
import { InvalidToken } from '../errors/invalid-token';
import { LackOfSession } from '../errors/lack-of-session';
import { ConfigService } from '@app/config';
import { Session, SessionDocument } from '../schemas/session.schema';

export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validate(token: string): Promise<boolean> {
    const user = await this.getUserFromToken(token);
    return user !== null;
  }

  async create(userId: string): Promise<string> {
    const expiresIn = parseInt(this.configService.get('jwt').jwtExpiresInSeconds, 10);
    const token = this.jwtService.sign({ usr: userId }, { expiresIn });

    await this.sessionModel.create({
      token,
      user: userId,
      expiresAt: new Date(Date.now() + expiresIn * 1000)
    });

    return token;
  }

  async destroy(token: string) {
    await this.sessionModel.findOneAndDelete({ token });
  }

  private async getUserFromToken(token: string): Promise<User> {
    const isValid = this.jwtService.verify(token);
    
    if (!isValid) throw new InvalidToken();

    const userId = this.decodeUserId(token);

    const session = await this.sessionModel.findOne({ user: userId });

    if (!session) throw new LackOfSession(); 

    const user = await this.userModel.findById(userId);

    return user as User;
  }

  private decodeUserId(token: string) {
    const payload = this.jwtService.decode(token);
    
    if (typeof payload === 'string') throw new InvalidToken();

    const { usr: userId } = payload;

    return userId;
  }
}
