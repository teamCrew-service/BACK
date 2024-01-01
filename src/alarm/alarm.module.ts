import { Module, forwardRef } from '@nestjs/common';
import { AlarmService } from '@src/alarm/alarm.service';
import { AlarmRepository } from '@src/alarm/alarm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from '@src/alarm/entities/alarm.entity';
import { AlarmController } from '@src/alarm/alarm.controller';
import { CrewModule } from '@src/crew/crew.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alarm]),
    // 순환 의존성
    forwardRef(() => CrewModule),
  ],
  providers: [AlarmService, AlarmRepository],
  exports: [AlarmService, AlarmRepository],
  controllers: [AlarmController],
})
export class AlarmModule {}
