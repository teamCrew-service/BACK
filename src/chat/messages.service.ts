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

    try {
      const savedMessage = await message.save();
      console.log('Message saved successfully:', savedMessage);
      return savedMessage;
    } catch (error) {
      console.error('Error while saving the message:', error);
      throw error;
    }
  }
}
