import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post(':crewId')
  async create(
    @Param('crewId', ParseIntPipe) crewId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    console.log('create method in MessageController called');
    const { userId, content } = createMessageDto;
    return this.messagesService.createMessage(crewId, userId, content);
  }
}
