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

@WebSocketGateway({ namespace: '/', cors: true, path: '/chat' }) // websocket 게이트웨이 설정
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // 웹소켓 서버 객체

  // 의존성 주입
  constructor(
    private roomsService: RoomsService,
    private messagesService: MessagesService,
  ) {}

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

  // @SubscribeMessage('joinRoom')
  // async handleJoinRoom(
  //   client: Socket,
  //   payload: { roomId: number; userId: number },
  // ) {
  //   let room = await this.roomsService.findOne(payload.roomId.toString()); // roomId로 방을 찾음
  //   if (!room) {
  //     // 방이 존재하지 않으면 새로운 방 생성
  //     await this.roomsService.create(payload.roomId);
  //     room = await this.roomsService.findOne(payload.roomId.toString());
  //   }
  //   if (room) {
  //     client.join(room._id.toString()); // 클라이언트를 방에 조인시킴
  //     this.server
  //       .to(room._id.toString())
  //       .emit('message', `User ${payload.userId} has joined the room.`);
  //   }
  // }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: { roomId: number; userId: number },
  ) {
    const room = await this.roomsService.findOrCreateByCrewId(payload.roomId);

    if (room) {
      client.join(room._id.toString());
      this.server
        .to(room._id.toString())
        .emit('message', `User ${payload.userId} has joined the room.`);
    }
  }

  @SubscribeMessage('leaveRoom') // leaveRoom 이벤트를 처리하는 메소드
  handleLeaveRoom(
    client: Socket,
    payload: { roomId: number; userId: number; content: string },
  ) {
    client.leave(payload.roomId.toString()); // 클라이언트를 방에서 떠나게 함
    this.server
      .to(payload.roomId.toString())
      .emit('message', `User ${payload.userId} has left the room.`); // 방에 떠난 클라이언트에게 메시지를 보냄
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { roomId: number; userId: number; content: string },
  ) {
    console.log('Payload: ', payload);

    // 메시지를 생성하고 DB에 저장
    const message = await this.messagesService.createMessage(
      payload.roomId,
      payload.userId,
      payload.content,
    );
    console.log('Created Message: ', message);
    this.server.to(payload.roomId.toString()).emit('message', message); // 방에 메시지를 보냄
  }
}
