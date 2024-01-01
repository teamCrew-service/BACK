import { Module, forwardRef } from '@nestjs/common';
import { VoteController } from '@src/vote/vote.controller';
import { VoteService } from '@src/vote/vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '@src/vote/entities/vote.entity';
import { VoteRepository } from '@src/vote/vote.repository';
import { CrewModule } from '@src/crew/crew.module';
import { MemberModule } from '@src/member/member.module';
import { VoteFormModule } from '@src/voteform/voteform.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    // 순환 의존성
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
    forwardRef(() => VoteFormModule),
  ],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository],
  exports: [VoteService, VoteRepository],
})
export class VoteModule {}
