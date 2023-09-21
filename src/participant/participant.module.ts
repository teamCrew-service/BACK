import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from './participant.repository';
import { Participant } from './entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  providers: [ParticipantService, ParticipantRepository],
  exports: [ParticipantService, ParticipantRepository],
})
export class ParticipantModule {}
