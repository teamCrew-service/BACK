import { Module, forwardRef } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ScheduleRepository } from './schedule.repository';
import { CrewModule } from 'src/crew/crew.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
    forwardRef(() => ParticipantModule),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  exports: [ScheduleService, ScheduleRepository],
})
export class scheduleModule {}
