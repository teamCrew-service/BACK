import { Injectable } from '@nestjs/common';
import { ReportRepository } from '@src/report/report.repository';
import { CreateReportDto } from '@src/report/dto/createReport.dto';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  /* 신고하기 */
  async createReport(
    createReportDto: CreateReportDto,
    userId: number,
    crewId: number,
  ): Promise<any> {
    try {
      const report = await this.reportRepository.createReport(
        createReportDto,
        userId,
        crewId,
      );
      return report;
    } catch (e) {
      console.error(e);
      throw new Error('ReportService/createReport');
    }
  }
}
