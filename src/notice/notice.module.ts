import { Module, forwardRef } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeRepository } from './notice.repository';
import { CrewModule } from 'src/crew/crew.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), forwardRef(() => CrewModule)],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository],
  exports: [NoticeService, NoticeRepository],
})
export class NoticeModule {}
