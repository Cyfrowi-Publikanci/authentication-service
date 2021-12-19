import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, index: { unique: true } })
  email: string;

  // Password can be empty, required for login with google
  // Password should be validated if loginByEmail is called 
  @Prop()
  password?: string; 

  @Prop()
  googleId?: string;

  @Prop()
  verifiedEmail?: boolean;

  @Prop()
  name?: string;

  @Prop()
  givenName?: string;

  @Prop()
  familyName?: string;

  @Prop()
  picture?: string;

  @Prop()
  locale?: string;

  @Prop()
  hd?: string;

  @Prop({ required: false })
  preferences: string;

  @Prop()
  notifications: [string];

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);