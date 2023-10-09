import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from './message.schema';

@Schema()
export class Room extends Document {
  @Prop({ unique: true })
  roomId: number;

  @Prop()
  roomName: string;

  @Prop([{ type: Types.ObjectId, ref: 'Message' }])
  messages: Message[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
