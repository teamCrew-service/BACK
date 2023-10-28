import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop()
  userId: number;

  @Prop()
  content: string;

  @Prop()
  crewId: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
