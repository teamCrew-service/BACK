import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin: ['http://localhost:3000', process.env.CORS_ORIGIN], // 클라이언트의 주소
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
  path: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // 웹소켓 서버 객체

  // 의존성 주입
  constructor(private messagesService: MessagesService) {}

  // 클라이언트가 연결되었을 때 실행되는 메소드
  handleConnection(client: Socket, ...args: any[]) {
    console.log(
      `Client connected: ${client.id}, args: ${JSON.stringify(args)}`,
    );
  }

  // 클라이언트가 연결을 끊었을 때 실행되는 메소드
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: { crewId: number; userId: number },
  ) {
    const messages = await this.messagesService.findMessagesBycrewId(
      payload.crewId,
      0,
    );
    console.log('findMessagesBycrewId messages', messages);

    if (messages && messages.length > 0) {
      console.log(
        `Sending previous messages to client ${client.id} for crewId ${payload.crewId}:`,
        messages,
      );
      client.join('' + messages[0].crewId);
      client.emit('previousMessages', messages);
      this.server
        .to('' + messages[0].crewId)
        .emit('noticeMessage', `User ${payload.userId} has joined the room.`);
      client.emit('serverMessage', 'joinRoom 성공');
    }
  }

  @SubscribeMessage('leaveRoom') // leaveRoom 이벤트를 처리하는 메소드
  handleLeaveRoom(
    client: Socket,
    payload: { crewId: number; userId: number; content: string },
  ) {
    client.leave('' + payload.crewId); // 클라이언트를 방에서 떠나게 함
    this.server
      .to('' + payload.crewId)
      .emit('noticeMessage', `User ${payload.userId} has left the room.`); // 방에 떠난 클라이언트에게 메시지를 보냄
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { crewId: number; userId: number; content: string; user: string },
  ) {
    console.log('Payload: ', payload);

    // 메시지를 생성하고 DB에 저장
    const message = await this.messagesService.createMessage(
      payload.crewId,
      payload.userId,
      payload.content,
    );
    console.log('Created Message: ', message['_doc']);
    this.server.to('' + payload.crewId).emit('message', { ...message['_doc'] }); // 방에 메시지를 보냄
  }
}
