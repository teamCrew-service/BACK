import { Module } from '@nestjs/common';
import { ChatGateway } from '@src/chat/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '@src/chat/schemas/message.schema';
import { MessagesService } from '@src/chat/messages.service';
import { MessageController } from '@src/chat/message.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessagesService, ChatGateway],
  exports: [MessagesService],
})
export class ChatModule {}
