import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AlarmService } from '@src/alarm/alarm.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrewService } from '@src/crew/crew.service';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Controller('alarm')
@ApiTags('Alarm API')
export class AlarmController {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly alarmService: AlarmService,
    private readonly crewService: CrewService,
  ) {}

  /* 알림 확인 */
  @Post('checkAlarm')
  @ApiOperation({
    summary: '알림 확인 API',
    description: '알림 확인',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 200,
    description: '알림 확인',
  })
  @ApiBearerAuth('accessToken')
  async checkAlarm(
    @Res() res: any,
    @Param('crewId') crewId: number,
  ): Promise<Object> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findCrewDetail(crewId);

      if (crew.crewId === null) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.alarmService.checkAlarm(crewId, userId);

      // 알림 확인
      const alarm = await this.alarmService.findOneAlarm(crewId, userId);
      if (!alarm) {
        throw new HttpException(
          '알림이 존재하지 않습니다.',
          HttpStatus.NOT_FOUND,
        );
      } else {
        return res.status(HttpStatus.OK).json({ message: '알림 확인 완료' });
      }
    } catch (e) {
      this.errorHandlingService.handleException(
        'AlarmController/checkAlarm',
        e,
      );
    }
  }
}
