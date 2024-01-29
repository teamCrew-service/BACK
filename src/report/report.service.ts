import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ReportRepository } from '@src/report/report.repository';
import { CreateReportDto } from '@src/report/dto/createReport.dto';
import { Report } from '@src/report/entities/report.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ReportService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly reportRepository: ReportRepository,
  ) {}

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
      this.logger.error('ReportService/createReport', e.message);
      throw new HttpException(
        'ReportService/createReport',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
