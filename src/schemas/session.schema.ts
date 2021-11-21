import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from './user.schema';
import { UserSettings } from './settings.schema';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop()
  token: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user: Types.ObjectId | User;

  @Prop({
    default: null,
  })

  @Prop({ 
    type: Types.ObjectId, 
    ref: UserSettings.name })
  settings?: UserSettings;

  expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session)
  .index('expiresAt', {
    expireAfterSeconds: 0,
  })
  .index('token', {
    unique: true,
  });
