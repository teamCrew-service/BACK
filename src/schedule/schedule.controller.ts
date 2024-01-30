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
import { ScheduleService } from '@src/schedule/schedule.service';
import { CreateScheduleDto } from '@src/schedule/dto/createSchedule.dto';
import { EditScheduleDto } from '@src/schedule/dto/editSchedule.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { ParticipantService } from '@src/participant/participant.service';
import { CrewService } from '@src/crew/crew.service';
import { MemberService } from '@src/member/member.service';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Controller('schedule')
@ApiTags('Schedule API')
export class ScheduleController {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly scheduleService: ScheduleService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
    private readonly participantService: ParticipantService,
  ) {}

  // 일정 생성
  @Post('/:crewId/createSchedule')
  @ApiOperation({
    summary: '일정 생성 API',
    description: '일정을 생성합니다.',
  })
  @ApiParam({ name: 'crewId' })
  @ApiResponse({
    status: 201,
    description: '일정 생성 성공',
  })
  @ApiBearerAuth('accessToken')
  async createschedule(
    @Param('crewId') crewId: number,
    @Body() createscheduleDto: CreateScheduleDto,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      // 권한 확인
      if (crew.userId !== userId) {
        throw new HttpException(
          '일정 등록 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // schedule 생성
      const result = await this.scheduleService.createSchedule(
        createscheduleDto,
        userId,
        crewId,
      );

      return res.json(result);
    } catch (e) {
      this.errorHandlingService.handleException(
        'ScheduleController/createschedule',
        e,
      );
    }
  }

  // 일정 수정
  @Put('edit/:crewId/:scheduleId')
  @ApiOperation({
    summary: '일정 수정 API',
    description: '원하는 일정을 수정합니다.',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiParam({ name: 'scheduleId', description: 'scheduleId' })
  @ApiResponse({
    status: 200,
    description: '일정 수정 성공',
  })
  @ApiBearerAuth('accessToken')
  async editschedule(
    @Res() res: any,
    @Param('crewId') crewId: number,
    @Param('scheduleId') scheduleId: number,
    @Body() editscheduleDto: EditScheduleDto,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '모임이 존재하지 않습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 권한 확인
      if (crew.userId !== userId) {
        throw new HttpException(
          '일정 수정 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // schedule 수정
      const updatedSchedule = await this.scheduleService.editSchedule(
        crewId,
        scheduleId,
        editscheduleDto,
      );
      if (!updatedSchedule) {
        throw new HttpException('일정 수정 실패', HttpStatus.BAD_REQUEST);
      }
      return res.status(HttpStatus.OK).json({ message: '일정 수정 성공' });
    } catch (e) {
      this.errorHandlingService.handleException(
        'ScheduleController/editschedule',
        e,
      );
    }
  }

  // 일정 상세 조회
  @Get('detail/:crewId/:scheduleId')
  @ApiOperation({
    summary: '일정 상세 조회 API',
    description: 'scheduleId에 해당하는 일정 글을 상세 조회.',
  })
  @ApiParam({ name: 'crewId', description: 'scheduleId' })
  @ApiResponse({
    status: 200,
    description: '일정을 상세 조회합니다.',
    schema: {
      example: {
        schedule: {
          schedule_scheduleTitle: '퇴근 후 40분 걷기',
          schedule_scheduleDDay: '2023-08-19T03:44:19.661Z',
          schedule_scheduleContent: '오늘 퇴근 후 40분 걷기 합니다',
          schedule_scheduleAddress: '일산 호수공원',
          schedule_schedulePlaceName: '고양체육관',
          crew_crewMaxMember: 8,
          scheduleAttendedMember: '6',
          captainProfileImage: 'url',
        },
        participant: {
          participant_participantId: 1,
          participant_userId: 1,
          users_profileImage: 'url',
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findscheduleDetail(
    @Param('scheduleId') scheduleId: number,
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // 일정 상세 조회
      const schedule = await this.scheduleService.findScheduleDetail(
        scheduleId,
        crewId,
      );
      if (!schedule || schedule.scheduleId === null) {
        throw new HttpException(
          '존재하지 않는 일정입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 참여자 조회
      const participant = await this.participantService.findAllParticipant(
        crewId,
        scheduleId,
      );
      return res.status(HttpStatus.OK).json({ schedule, participant });
    } catch (e) {
      this.errorHandlingService.handleException(
        'ScheduleController/findscheduleDetail',
        e,
      );
    }
  }

  // 일정 삭제
  @Delete('delete/:crewId/:scheduleId')
  @ApiOperation({
    summary: '일정 글 삭제 API',
    description: '일정을 삭제합니다.',
  })
  @ApiParam({ name: 'crewId', description: 'scheduleId' })
  @ApiResponse({
    status: 200,
    description: '일정을 삭제합니다.',
    schema: {
      example: {
        message: '일정 삭제 성공했습니다.',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async deleteschedule(
    @Param('crewId') crewId: number,
    @Param('scheduleId') scheduleId: number,
    @Res() res: any,
  ): Promise<Object | Array<Object>> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '모임이 존재하지 않습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 권한 확인
      if (crew.userId !== userId) {
        throw new HttpException(
          '일정 삭제 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 일정에 관련 된 정보 삭제 처리
      const result = await Promise.all([
        this.scheduleService.deleteSchedule(scheduleId, crewId),
        this.participantService.deleteParticipantBySchedule(scheduleId, crewId),
      ]);
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      this.errorHandlingService.handleException(
        'ScheduleController/deleteschedule',
        e,
      );
    }
  }

  /* schedule에 참가하기 */
  @Post('participate/:crewId/:scheduleId')
  @ApiOperation({
    summary: '일정 참여 API',
    description: '일정 참여',
  })
  @ApiParam({ name: 'crewId', description: '모임 Id' })
  @ApiParam({ name: 'scheduleId', description: '일정 Id' })
  @ApiResponse({
    status: 200,
    description: '일정 참여 완료',
  })
  @ApiBearerAuth('accessToken')
  async participateSchedule(
    @Param('crewId') crewId: number,
    @Param('scheduleId') scheduleId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '모임이 존재하지 않습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 멤버, 참여자 조회
      const member = await this.memberService.findAllMember(crewId);
      const participant = await this.participantService.findAllParticipant(
        crewId,
        scheduleId,
      );

      // 모임장은 참여 여부에 포함하지 않는다.
      if (crew.userId === userId) {
        return res.status(HttpStatus.OK).json({ message: '모임장입니다.' });
      }

      // 참가자 조회해서 참가 인원인지
      for (let i = 0; i < participant.length; i++) {
        if (userId === participant[i].userId) {
          throw new HttpException(
            '이미 참여한 인원입니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // 일정에 참가, member가 아닐 경우 참가 불가
      for (let i = 0; i < member.length; i++) {
        if (userId === member[i].userId) {
          await this.participantService.participateSchedule(
            userId,
            crewId,
            scheduleId,
          );
          return res
            .status(HttpStatus.OK)
            .json({ message: '일정에 참가 성공' });
        }
      }
      throw new HttpException(
        'crew원이 아닙니다. 일정에 참가할 권한이 없습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'ScheduleController/participateSchedule',
        e,
      );
    }
  }

  /* 참여한 schedule 취소하기 */
  @Delete('cancelParticipate/:crewId/:scheduleId')
  @ApiOperation({
    summary: '일정 참여 취소 API',
    description: '일정 참여 취소',
  })
  @ApiParam({ name: 'crewId', description: '모임 Id' })
  @ApiParam({ name: 'scheduleId', description: '일정 Id' })
  @ApiResponse({
    status: 200,
    description: '일정 참여 취소 완료',
  })
  @ApiBearerAuth('accessToken')
  async cancelParticipate(
    @Param('crewId') crewId: number,
    @Param('scheduleId') scheduleId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 참여자 조회
      const participant = await this.participantService.findAllParticipant(
        crewId,
        scheduleId,
      );

      // 참가자 조회해서 참가 인원인지 확인 뒤 취소 처리
      for (let i = 0; i < participant.length; i++) {
        if (userId === participant[i].userId) {
          const canceledParticipant =
            await this.participantService.cancelParticipate(
              crewId,
              scheduleId,
              userId,
            );
          if (!canceledParticipant) {
            throw new HttpException(
              '일정 참가 취소 실패',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
          return res
            .status(HttpStatus.OK)
            .json({ message: '일정 참가 취소 성공' });
        }
      }

      throw new HttpException(
        '참여한 인원이 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'ScheduleController/cancelParticipate',
        e,
      );
    }
  }
}
