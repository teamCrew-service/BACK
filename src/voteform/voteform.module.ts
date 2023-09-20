import { Module, forwardRef } from '@nestjs/common';
import { VoteformController } from './voteform.controller';
import { VoteFormService } from './voteform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteForm } from './entities/voteform.entity';
import { VoteFormRepository } from './voteform.repository';
import { CrewModule } from 'src/crew/crew.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteForm]),
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [VoteformController],
  providers: [VoteFormService, VoteFormRepository],
  exports: [VoteFormService, VoteFormRepository],
})
export class VoteFormModule {}
