import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from './room.schema';

@Schema()
export class Message extends Document {
  @Prop()
  userId: number;

  @Prop()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Room' })
  room: Room;
}
export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
