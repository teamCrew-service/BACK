import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ReportService } from '@src/report/report.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReportDto } from '@src/report/dto/createReport.dto';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Controller('report')
@ApiTags('Report API')
export class ReportController {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly reportService: ReportService,
  ) {}

  /* 신고하기 */
  @Post(':crewId')
  @ApiOperation({
    summary: '신고하기 API',
    description: '부적절한 모임을 신고합니다.',
  })
  @ApiParam({ name: 'crewId', description: '모임 Id' })
  @ApiResponse({
    status: 201,
    description: '신고하기 성공',
  })
  @ApiBearerAuth('accessToken')
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 신고
      await this.reportService.createReport(createReportDto, userId, crewId);
      return res.status(HttpStatus.OK).json({ message: '신고하기 성공' });
    } catch (e) {
      this.errorHandlingService.handleException(
        'ReportController/createReport',
        e,
      );
    }
  }
}
