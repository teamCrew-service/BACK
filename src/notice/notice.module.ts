import { Module, forwardRef } from '@nestjs/common';
import { NoticeController } from '@src/notice/notice.controller';
import { NoticeService } from '@src/notice/notice.service';
import { NoticeRepository } from '@src/notice/notice.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from '@src/notice/entities/notice.entity';
import { CrewModule } from '@src/crew/crew.module';
import { VoteFormModule } from '@src/voteform/voteform.module';

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
