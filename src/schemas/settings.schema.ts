import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = UserSettings & Document;

@Schema()
export class UserSettings {
  @Prop({ required: true, index: { unique: true } })
  userid: string;

  @Prop({ required: false })
  preferences: string;

  @Prop({ required: false })
  waschanged: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(UserSettings);