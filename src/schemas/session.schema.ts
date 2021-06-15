import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from './user.schema';

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
  expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session)
  .index('expiresAt', {
    expireAfterSeconds: 0,
  })
  .index('token', {
    unique: true,
  });
