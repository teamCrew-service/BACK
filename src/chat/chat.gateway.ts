import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { MessagesService } from './messages.service';

@WebSocketGateway({ namespace: '/', cors: true, path: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private roomsService: RoomsService,
    private messagesService: MessagesService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(
      `Client connected: ${client.id}, args: ${JSON.stringify(args)}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: { roomId: number; userId: number },
  ) {
    const room = await this.roomsService.findOne(payload.roomId.toString());
    if (room) {
      client.join(room._id.toString());
      this.server
        .to(room._id.toString())
        .emit('message', `User ${payload.userId} has joined the room.`);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    client: Socket,
    payload: { roomId: number; userId: number; content: string },
  ) {
    client.leave(payload.roomId.toString());
    this.server
      .to(payload.roomId.toString())
      .emit('message', `User ${payload.userId} has left the room.`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { roomId: number; userId: number; content: string },
  ) {
    console.log('Payload: ', payload);
    const message = await this.messagesService.createMessage(
      payload.roomId,
      payload.userId,
      payload.content,
    );
    console.log('Created Message: ', message);
    this.server.to(payload.roomId.toString()).emit('message', message);
  }
}
