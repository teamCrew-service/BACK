import { Module } from '@nestjs/common';
import { ReportController } from '@src/report/report.controller';
import { ReportService } from '@src/report/report.service';
import { ReportRepository } from '@src/report/report.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '@src/report/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  exports: [ReportService, ReportRepository],
})
export class ReportModule {}
