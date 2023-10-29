import { Module, forwardRef } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { NoticeRepository } from './notice.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { CrewModule } from 'src/crew/crew.module';
import { VoteFormModule } from 'src/voteform/voteform.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice]),
    // 순환 의존성
    forwardRef(() => CrewModule),
    forwardRef(() => VoteFormModule),
  ],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository],
  exports: [NoticeService, NoticeRepository],
})
export class NoticeModule {}
