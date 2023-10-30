import { Module, forwardRef } from '@nestjs/common';
import { LeavecrewService } from './leavecrew.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leavecrew } from './entities/leavecrew.entity';
import { CrewModule } from 'src/crew/crew.module';
import { LeavecrewRepository } from './leavecrew.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Leavecrew]),
    // 순환 의존성
    forwardRef(() => CrewModule),
  ],
  providers: [LeavecrewService, LeavecrewRepository],
  exports: [LeavecrewService, LeavecrewRepository],
})
export class LeavecrewModule {}
