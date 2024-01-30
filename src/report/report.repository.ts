import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '@src/report/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from '@src/report/dto/createReport.dto';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class ReportRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  /* 신고하기 */
  async createReport(
    createReportDto: CreateReportDto,
    userId: number,
    crewId: number,
  ): Promise<Report> {
    try {
      const report = new Report();
      report.userId = userId;
      report.crewId = crewId;
      report.reportContent = createReportDto.reportContent;
      await this.reportRepository.save(report);
      return report;
    } catch (e) {
      this.errorHandlingService.handleException(
        'ReportRepository/createReport',
        e,
      );
    }
  }
}
