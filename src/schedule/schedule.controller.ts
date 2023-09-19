import {
  Controller,
  Get,
  Post,
  Put,
  HttpException,
  HttpStatus,
  Res,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { EditScheduleDto } from './dto/editSchedule.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@Controller('schedule')
@ApiTags('Schedule API')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // 공지사항 조회
  @Get('comingDate')
  @ApiOperation({
    summary: '다가오는 일정 리스트 조회 API',
    description: '다가오는 일정 리스트 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '다가오는 일정 리스트 조회합니다.',
    schema: {
      example: {
        schedule: {
          scheduleFTitle: '퇴근 후 40분 걷기',
          scheduleDDay: '2023-08-19T03:44:19.661Z',
        },
        participatedUser: { profileImage: 'URI' },
      },
    },
  })
  async findschedule(@Res() res: any): Promise<any> {
    try {
      // 다가오는 일정 리스트 조회
      const userId = res.locals.user ? res.locals.user.userId : null;
      const schedule = await this.scheduleService.findSchedule(userId);

      // 다가오는 일정 리스트 조회 결과가 없을 경우
      if (schedule.length === 0) {
        // 조회 된 일정이 없을 경우 null로 반환
        return res.status(HttpStatus.NOT_FOUND).json(null);
      }
      // 다가오는 일정 리스트 조회 결과가 있을 경우
      return res.status(HttpStatus.OK).json(schedule);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `리스트 조회 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 공지사항 생성
  @Post('/:crewId/createSchedule')
  async createschedule(
    @Param('crewId') crewId: number,
    @Body() createscheduleDto: CreateScheduleDto,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;

    const result = await this.scheduleService.createSchedule(
      createscheduleDto,
      userId,
      crewId,
    );

    return res.json(result);
  }

  // 공지사항 수정
  @Put('edit/:crewId/:scheduleId')
  async editschedule(
    @Res() res: any,
    @Param('crewId') crewId: number,
    @Param('scheduleId') scheduleId: number,
    @Body() editscheduleDto: EditScheduleDto,
  ): Promise<any> {
    const { userId } = res.locals.user;
    const result = await this.scheduleService.editSchedule(
      userId,
      crewId,
      scheduleId,
      editscheduleDto,
    );
    return res.json(result);
  }

  // 공지사항 상세 조회
  @Get('detail/:crewId/:scheduleId')
  async findscheduleDetail(
    @Param('scheduleId') scheduleId: number,
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const schedule = await this.scheduleService.findScheduleDetail(
        scheduleId,
        crewId,
      );
      return res.status(HttpStatus.OK).json(schedule);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `공지사항 상세 조회 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 공지사항 삭제
  @Delete('delete/:crewId/:scheduleId')
  async deleteschedule(
    @Param('crewId') crewId: number,
    @Param('scheduleId') scheduleId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const result = await this.scheduleService.deleteSchedule(
        scheduleId,
        crewId,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `공지사항 삭제 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
