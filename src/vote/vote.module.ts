import { Module, forwardRef } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { VoteRepository } from './vote.repository';
import { CrewModule } from 'src/crew/crew.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository],
  exports: [VoteService, VoteRepository],
})
export class VoteModule {}
