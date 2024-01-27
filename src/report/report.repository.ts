import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '@src/report/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from '@src/report/dto/createReport.dto';

@Injectable()
export class ReportRepository {
  constructor(
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
      console.error(e);
      throw new Error('ReportRepository/createReport');
    }
  }
}
