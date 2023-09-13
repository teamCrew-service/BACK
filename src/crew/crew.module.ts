import { Module, forwardRef } from '@nestjs/common';
import { CrewService } from './crew.service';
import { HomeModule } from 'src/home/home.module';
import { CrewRepository } from './crew.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from './entities/crew.entity';
import { CrewController } from './crew.controller';
import { SignupModule } from 'src/signup/signup.module';
import { MemberModule } from 'src/member/member.module';
import { NoticeModule } from 'src/notice/notice.module';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crew]),
    forwardRef(() => HomeModule),
    forwardRef(() => SignupModule),
    forwardRef(() => MemberModule),
    forwardRef(() => NoticeModule),
    forwardRef(() => LikeModule),
  ],
  providers: [CrewService, CrewRepository],
  exports: [CrewService, CrewRepository],
  controllers: [CrewController],
})
export class CrewModule {}
