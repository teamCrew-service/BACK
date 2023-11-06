import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SignupModule } from './signup/signup.module';
import { HomeModule } from './home/home.module';
import { CrewModule } from './crew/crew.module';
import { scheduleModule } from './schedule/schedule.module';
import { AuthMiddleWare } from './middleware/auth.middleware';
import { MemberModule } from './member/member.module';
import { JwtService } from '@nestjs/jwt';
import { LoginMiddleware } from './middleware/login.middleware';
import { LikeModule } from './like/like.module';
import { TopicModule } from './topic/topic.module';
import { NoticeModule } from './notice/notice.module';
import { VoteFormModule } from './voteform/voteform.module';
import { VoteModule } from './vote/vote.module';
import { ParticipantModule } from './participant/participant.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageModule } from './image/image.module';
import { ReportModule } from './report/report.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { AlarmModule } from './alarm/alarm.module';

@Module({
  imports: [
    // cronJob
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // db 설정
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      timezone: 'Asia/Seoul',
      // synchronize: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    SignupModule,
    HomeModule,
    CrewModule,
    scheduleModule, // Cron-Job Scheduling을 이용하기 위해 기존의 모듈을 대문자 ScheduleModule에서 소문자 scheduleModule로 바꿈
    MemberModule,
    LikeModule,
    TopicModule,
    NoticeModule,
    VoteFormModule,
    VoteModule,
    ParticipantModule,
    ImageModule,
    ReportModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ChatModule,
    AlarmModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // auth 미들웨어
    consumer.apply(AuthMiddleWare).forRoutes(
      { path: 'mypage', method: RequestMethod.GET },
      { path: 'mypage/edit', method: RequestMethod.PUT },
      { path: 'mycrew/likedcrew', method: RequestMethod.GET },
      { path: 'mycrew/joinedcrew', method: RequestMethod.GET },
      { path: 'mycrew/mycreatedcrew', method: RequestMethod.GET },
      { path: 'mycrew/waitingcrew', method: RequestMethod.GET },
      { path: 'auth/info', method: RequestMethod.PUT },
      { path: 'unsubscribe', method: RequestMethod.POST },
      { path: 'deleteUnsubscribe', method: RequestMethod.DELETE },
      { path: 'crew/createcrew', method: RequestMethod.POST },
      { path: 'crew/:crewId/editThumbnail', method: RequestMethod.PUT },
      { path: 'crew/:crewId/edit', method: RequestMethod.PUT },
      { path: 'crew/:crewId/delete', method: RequestMethod.DELETE },
      { path: 'crew/delegate/:crewId', method: RequestMethod.POST },
      { path: 'schedule/:crewId/createSchedule', method: RequestMethod.POST },
      { path: 'schedule/edit/:crewId/:scheduleId', method: RequestMethod.PUT },
      {
        path: 'schedule/detail/:crewId/:scheduleId',
        method: RequestMethod.GET,
      },
      {
        path: 'schedule/delete/:crewId/:scheduleId',
        method: RequestMethod.DELETE,
      },
      {
        path: 'schedule/participate/:crewId/:scheduleId',
        method: RequestMethod.POST,
      },
      {
        path: 'schedule/cancelParticipate/:crewId/:scheduleId',
        method: RequestMethod.DELETE,
      },
      { path: 'signup/:crewId', method: RequestMethod.POST },
      { path: 'signupform/:signupFormId', method: RequestMethod.GET },
      {
        path: 'signup/:crewId/:signupFormId/submit',
        method: RequestMethod.POST,
      },
      { path: 'signup/:signupId/confirmsignup', method: RequestMethod.PUT },
      { path: 'signup/:crewId', method: RequestMethod.GET },
      { path: 'signup/mySubmitted/:crewId', method: RequestMethod.GET },
      { path: 'signup/mySubmitted/:crewId/edit', method: RequestMethod.PUT },
      { path: 'signup/mySubmitted/:crewId/delete', method: RequestMethod.PUT },
      { path: 'exitCrew/:crewId', method: RequestMethod.POST },
      { path: 'notice/:crewId/createNotice', method: RequestMethod.POST },
      { path: 'notice/:crewId', method: RequestMethod.GET },
      { path: 'notice/:crewId/:noticeId', method: RequestMethod.GET },
      { path: 'notice/edit/:crewId/:noticeId', method: RequestMethod.PUT },
      { path: 'notice/delete/:crewId/:noticeId', method: RequestMethod.DELETE },
      { path: 'voteform/:crewId/createVoteForm', method: RequestMethod.POST },
      { path: 'voteform/:crewId/:voteFormId', method: RequestMethod.GET },
      { path: 'voteform/edit/:crewId/:voteFormId', method: RequestMethod.PUT },
      {
        path: 'voteform/delete/:crewId/:voteFormId',
        method: RequestMethod.DELETE,
      },
      { path: 'vote/:crewId/:voteFormId', method: RequestMethod.POST },
      { path: 'vote/:crewId/:voteFormId', method: RequestMethod.GET },
      { path: 'vote/:crewId/:voteFormId', method: RequestMethod.PUT },
      { path: 'image/saveImage/:crewId', method: RequestMethod.POST },
      { path: 'image/:crewId', method: RequestMethod.GET },
      { path: 'image/:crewId/:imageId', method: RequestMethod.DELETE },
      { path: 'report/:crewId', method: RequestMethod.POST },
      { path: 'like/:crewId', method: RequestMethod.POST },
      { path: 'like/:crewId', method: RequestMethod.DELETE },
      { path: 'alarm/checkAlarm', method: RequestMethod.POST },
    );
    // login 미들웨어
    consumer
      .apply(LoginMiddleware)
      .forRoutes(
        { path: 'crew/:crewId', method: RequestMethod.GET },
        { path: 'home/comingDate', method: RequestMethod.GET },
        { path: 'home/wholeComingDate', method: RequestMethod.GET },
        { path: 'home/map', method: RequestMethod.GET },
        { path: 'home/map/:category', method: RequestMethod.GET },
        { path: 'home/:category', method: RequestMethod.GET },
      );
  }
}
