import { Module, forwardRef } from '@nestjs/common';
import { LeavecrewService } from '@src/leavecrew/leavecrew.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leavecrew } from '@src/leavecrew/entities/leavecrew.entity';
import { CrewModule } from '@src/crew/crew.module';
import { LeavecrewRepository } from '@src/leavecrew/leavecrew.repository';

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
