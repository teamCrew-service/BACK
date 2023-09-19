import { Module, forwardRef } from '@nestjs/common';
import { VoteformController } from './voteform.controller';
import { VoteFormService } from './voteform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteForm } from './entities/voteform.entity';
import { VoteFormRepository } from './voteform.repository';
import { CrewModule } from 'src/crew/crew.module';

@Module({
  imports: [TypeOrmModule.forFeature([VoteForm]), forwardRef(() => CrewModule)],
  controllers: [VoteformController],
  providers: [VoteFormService, VoteFormRepository],
  exports: [VoteFormService, VoteFormRepository],
})
export class VoteFormModule {}
