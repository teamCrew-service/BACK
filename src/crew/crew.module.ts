import { Module, forwardRef } from '@nestjs/common';
import { CrewService } from '@src/crew/crew.service';
import { HomeModule } from '@src/home/home.module';
import { CrewRepository } from '@src/crew/crew.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from '@src/crew/entities/crew.entity';
import { CrewController } from '@src/crew/crew.controller';
import { SignupModule } from '@src/signup/signup.module';
import { MemberModule } from '@src/member/member.module';
import { scheduleModule } from '@src/schedule/schedule.module';
import { LikeModule } from '@src/like/like.module';
import { NoticeModule } from '@src/notice/notice.module';
import { VoteFormModule } from '@src/voteform/voteform.module';
import { ImageModule } from '@src/image/image.module';
import { TopicModule } from '@src/topic/topic.module';
import { ChatModule } from '@src/chat/chat.module';
import { ParticipantModule } from '@src/participant/participant.module';
import { VoteModule } from '@src/vote/vote.module';
import { AlarmModule } from '@src/alarm/alarm.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crew]),
    // 순환 의존성
    forwardRef(() => UsersModule),
    forwardRef(() => HomeModule),
    forwardRef(() => SignupModule),
    forwardRef(() => MemberModule),
    forwardRef(() => scheduleModule),
    forwardRef(() => LikeModule),
    forwardRef(() => NoticeModule),
    forwardRef(() => VoteFormModule),
    forwardRef(() => ImageModule),
    forwardRef(() => TopicModule),
    forwardRef(() => ChatModule),
    forwardRef(() => ParticipantModule),
    forwardRef(() => VoteModule),
    forwardRef(() => AlarmModule),
  ],
  providers: [CrewService, CrewRepository],
  exports: [CrewService, CrewRepository],
  controllers: [CrewController],
})
export class CrewModule {}
