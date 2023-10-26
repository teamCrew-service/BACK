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
    crewId: number,
    userId: number,
    content: string,
  ): Promise<Message> {
    console.log('createMessage called with:', crewId, userId, content);
    const message = new this.messageModel({
      userId,
      content,
      crewId,
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

  async findMessagesBycrewId(
    crewId: number,
    skip: number,
    limit: number = 20,
  ): Promise<Message[]> {
    try {
      // 방 번호와 skip, limit을 기반으로 이전 메시지를 조회합니다.
      const messages = await this.messageModel
        .find({ room: crewId })
        .sort({ createdAt: -1 }) // 최근 메시지부터 불러오기
        .skip(skip)
        .limit(limit)
        .exec();

      // 결과를 반환할 때는 최신 메시지가 먼저 오도록 역순으로 반환합니다.
      return messages.reverse();
    } catch (error) {
      console.error('Error while fetching previous messages:', error);
      throw error;
    }
  }
}
