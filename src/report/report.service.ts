import { Injectable } from '@nestjs/common';
import { ReportRepository } from '@src/report/report.repository';
import { CreateReportDto } from '@src/report/dto/createReport.dto';
import { Report } from '@src/report/entities/report.entity';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  /* 신고하기 */
  async createReport(
    createReportDto: CreateReportDto,
    userId: number,
    crewId: number,
  ): Promise<Report> {
    try {
      return await this.reportRepository.createReport(
        createReportDto,
        userId,
        crewId,
      );
    } catch (e) {
      console.error(e);
      throw new Error('ReportService/createReport');
    }
  }
}
