import { Module } from '@nestjs/common';
import { VoteformController } from './voteform.controller';
import { VoteFormService } from './voteform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteForm } from './entities/voteform.entity';
import { VoteFormRepository } from './voteform.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VoteForm])],
  controllers: [VoteformController],
  providers: [VoteFormService, VoteFormRepository],
  exports: [VoteFormService, VoteFormRepository],
})
export class VoteformModule {}
