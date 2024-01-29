import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '@src/report/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from '@src/report/dto/createReport.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ReportRepository {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
      this.logger.error('ReportRepository/createReport', e.message);
      throw new HttpException(
        'ReportRepository/createReport',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
