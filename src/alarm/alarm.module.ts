import { Module, forwardRef } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmRepository } from './alarm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';
import { AlarmController } from './alarm.controller';
import { CrewModule } from 'src/crew/crew.module';

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
