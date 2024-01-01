import { Module, forwardRef } from '@nestjs/common';
import { VoteformController } from '@src/voteform/voteform.controller';
import { VoteFormService } from '@src/voteform/voteform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteForm } from '@src/voteform/entities/voteform.entity';
import { VoteFormRepository } from '@src/voteform/voteform.repository';
import { CrewModule } from '@src/crew/crew.module';
import { MemberModule } from '@src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteForm]),
    //순환 의존성
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [VoteformController],
  providers: [VoteFormService, VoteFormRepository],
  exports: [VoteFormService, VoteFormRepository],
})
export class VoteFormModule {}
