import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '@src/chat/schemas/message.schema';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(
    crewId: number,
    userId: number,
    content: string,
  ): Promise<Message> {
    console.log('createMessage called with:', crewId, userId, content);

    const localDate = new Date();
    localDate.setHours(localDate.getHours() + 9); // 한국 시간으로 변경
    const message = new this.messageModel({
      userId,
      content,
      crewId,
      createdAt: localDate,
    });
    console.log('Message object created:', message);

    try {
      const savedMessage = await message.save();
      console.log('Message saved successfully:', savedMessage);
      return savedMessage;
    } catch (error) {
      this.errorHandlingService.handleException(
        'Error while saving the message:',
        error,
      );
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
        .find({ crewId: crewId })
        .sort({ createdAt: -1 }) // 최근 메시지부터 불러오기
        .skip(skip)
        .limit(limit)
        .exec();

      // 결과를 반환할 때는 최신 메시지가 먼저 오도록 역순으로 반환합니다.
      return messages.reverse();
    } catch (error) {
      this.errorHandlingService.handleException(
        'Error while fetching previous messages:',
        error,
      );
    }
  }
}
