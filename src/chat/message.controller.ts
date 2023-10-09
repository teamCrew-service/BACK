import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post(':roomId')
  async create(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    console.log('create method in MessageController called');
    const { userId, content } = createMessageDto;
    return this.messagesService.createMessage(roomId, userId, content);
  }
}
