import { Module, forwardRef } from '@nestjs/common';
import { ScheduleController } from '@src/schedule/schedule.controller';
import { ScheduleService } from '@src/schedule/schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '@src/schedule/entities/schedule.entity';
import { ScheduleRepository } from '@src/schedule/schedule.repository';
import { CrewModule } from '@src/crew/crew.module';
import { ParticipantModule } from '@src/participant/participant.module';
import { MemberModule } from '@src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    // 순환 의존성
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
    forwardRef(() => ParticipantModule),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
  exports: [ScheduleService, ScheduleRepository],
})
export class scheduleModule {}
