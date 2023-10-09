import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(
    roomId: number,
    userId: number,
    content: string,
  ): Promise<Message> {
    console.log('createMessage called with:', roomId, userId, content);
    const message = new this.messageModel({
      userId,
      content,
      room: roomId,
    });
    console.log('Message object created:', message);
    // return await message.save();
    console.log('Attempting to save message to the database'); // 로그 추가
    const savedMessage = await message.save();
    console.log('Message saved successfully:', savedMessage); // 로그 추가
    return savedMessage;
  }
}
