import {
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
  Controller,
  Post,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CrewService } from './crew.service';
import { EditCrewDto } from './dto/editCrew.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { SignupService } from 'src/signup/signup.service';
import { MemberService } from 'src/member/member.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { JoinCreateCrewDto } from './dto/joinCreateCrew.dto';
import { NoticeService } from 'src/notice/notice.service';
import { VoteFormService } from 'src/voteform/voteform.service';
import { LikeService } from 'src/like/like.service';
import { ImageService } from 'src/image/image.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfigThumbnail } from 'src/crew/multerConfig';
import { multerConfigImage } from 'src/crew/multerConfig';
import { join } from 'path';
import { TopicService } from 'src/topic/topic.service';
import { DelegateDto } from './dto/delegate.dto';

export class CrewFilesUploadDto {
  @ApiProperty()
  JoinCreateCrewDto: JoinCreateCrewDto;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'The files to upload',
  })
  files: any[];
}
@Controller('crew')
@ApiTags('Crew API')
export class CrewController {
  constructor(
    private readonly crewService: CrewService,
    private readonly topicService: TopicService,
    private readonly signupService: SignupService,
    private readonly memberService: MemberService,
    private readonly scheduleService: ScheduleService,
    private readonly noticeService: NoticeService,
    private readonly voteFormService: VoteFormService,
    private readonly likeService: LikeService,
    private readonly imageService: ImageService,
  ) {}

  /* 모임 생성 */
  @Post('createcrew')
  @ApiOperation({
    summary: '모임 생성 API',
    description: '모임을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '모임 생성 성공',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
    type: CrewFilesUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', 1, multerConfigThumbnail))
  @ApiBearerAuth('accessToken')
  async createCrew(
    @UploadedFiles() files,
    @Body('JoinCreateCrewDto') joinCreateCrewDto: any,
    @Res() res: any,
  ): Promise<any> {
    //console.log(joinCreateCrewDto);
    //joinCreateCrewDto = JSON.parse(joinCreateCrewDto);
    let { createCrewDto, createSignupFormDto } = JSON.parse(joinCreateCrewDto);
    const { userId } = res.locals.user;
    //thumbnail 을 aws3에 업로드하고 그 url을 받아온다.
    //const filename = `${createCrewDto.crewTitle}-${Date.now()}`; // 파일명 중복 방지
    //const thumbnail = await this.imageService.urlToS3(createCrewDto.thumbnail,filename,);
    //console.log(files[0].location);
    createCrewDto.thumbnail = files[0].location;
    //createCrewDto.thumbnail = 'thumbnail_temp';

    const newCrew = await this.crewService.createCrew(createCrewDto, userId);
    if (newCrew.crewSignup === true || newCrew.crewSignup === 1) {
      await this.signupService.createSignupForm(
        newCrew.crewId,
        createSignupFormDto,
      );
      return res
        .status(HttpStatus.CREATED)
        .json({ message: '모임 생성 성공', crewId: newCrew.crewId });
    } else {
      return res
        .status(HttpStatus.CREATED)
        .json({ message: '모임 생성 성공', crewId: newCrew.crewId });
    }
  }

  /*파일업로드 테스트*/
  @Post('uploads')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
    type: CrewFilesUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', 5, multerConfigImage))
  async uploadFiles(
    @UploadedFiles() files,
    @Body('JoinCreateCrewDto') body: any,
    @Res() res: any,
  ) {
    return res.status(HttpStatus.OK).json(
      files.map((files) => ({
        url: `${files.location}`,
      })),
    );
    return files.map((file) => ({ url: `/uploads/${file.filename}` }));
  }

  /* 모임 상세 조회*/
  @Get(':crewId')
  @ApiOperation({
    summary: '모임 상세 조회 API',
    description: '모임의 상세한 내용을 조회합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 상세한 내용을 조회합니다.',
    schema: {
      examples: {
        example1: {
          crew: {
            crew_crewId: '22',
            crew_category: '공연/축제',
            crew_crewAddress: '다대포해수욕장역 1번 출구',
            crew_crewType: '장기',
            crew_crewDDay: '2023-08-19T00:00:00.000Z',
            crew_crewMemberInfo: '털털한 분',
            crew_crewAgeInfo: '20대 초반 ~ 30대 후반',
            crew_crewSignup: 1,
            crew_crewTitle: '오늘은 뛸 수 있나?',
            crew_crewContent: '오늘 꼭 뛰고 싶은 사람들 모이세요',
            crew_thumbnail: '',
            crew_crewMaxMember: '8',
            crew_latitude: 35.047164,
            crew_longtitude: 128.967317,
            crew_createdAt: '2023-09-25T05:17:47.797Z',
            crew_deletedAt: null,
            captainId: '1',
            captainAge: 1995,
            captainLocation: '서울 종로구 서린동 136',
            captainMessage: '안녕하세요. 고양이를 키우고 있는 사람입니다.',
            captainNickname: 'CJW',
            captainProfileImage:
              'https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_1280.jpg',
            crewAttendedMember: '0',
            signupFormId: '1',
          },
          captainTopics: [
            {
              userId: '1',
              interestTopic: '친목',
            },
            {
              userId: '1',
              interestTopic: '음료',
            },
            {
              userId: '1',
              interestTopic: '책/글',
            },
          ],
          member: [1, 11, 10], // 게스트일 경우 비어있는 배열
          personType: 'person',
        },
        example2: {
          crew: {
            crew_crewId: '22',
            crew_category: '공연/축제',
            crew_crewAddress: '다대포해수욕장역 1번 출구',
            crew_crewType: '장기',
            crew_crewDDay: '2023-08-19T00:00:00.000Z',
            crew_crewMemberInfo: '털털한 분',
            crew_crewAgeInfo: '20대 초반 ~ 30대 후반',
            crew_crewSignup: 1,
            crew_crewTitle: '오늘은 뛸 수 있나?',
            crew_crewContent: '오늘 꼭 뛰고 싶은 사람들 모이세요',
            crew_thumbnail: '',
            crew_crewMaxMember: '8',
            crew_latitude: 35.047164,
            crew_longtitude: 128.967317,
            crew_createdAt: '2023-09-25T05:17:47.797Z',
            crew_deletedAt: null,
            captainId: '1',
            captainAge: 1995,
            captainLocation: '서울 종로구 서린동 136',
            captainMessage: '안녕하세요. 고양이를 키우고 있는 사람입니다.',
            captainNickname: 'CJW',
            captainProfileImage:
              'https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_1280.jpg',
            crewAttendedMember: '0',
          },
          captainTopics: [
            {
              userId: '1',
              interestTopic: '친목',
            },
            {
              userId: '1',
              interestTopic: '음료',
            },
            {
              userId: '1',
              interestTopic: '책/글',
            },
          ],
          member: [1, 11, 10],
          schedule: [
            {
              scheduleId: 1,
              userId: 3,
              scheduleTitle: '일요일 달리기!!',
              scheduleContent:
                '일요일 달리기 정모가 있습니다!! 많이 나와주세요!!',
              scheduleDDay: '2023-08-18T15:00:00.000Z',
              scheduleIsDone: 1,
              scheduleAddress: '일산 호수공원',
              scheduleMaxMember: '8',
              scheduleAttendedMember: '0',
              scheduleLatitude: 23.010203,
              scheduleLongitude: 106.102032,
              createdAt: '2023-09-22T02:32:18.356Z',
              participate: '1',
            },
          ],
          allNotice: {
            notice: {
              noticeTitle: '일산 호수공원 런닝!!',
              noticeContent:
                '일산 호수공원 저녁 8시에 런닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
              noticeAddress: '일산 호수공원',
              noticeDDay: '2023-08-19T03:44:19.661Z',
            },
            voteForm: {
              voteFormId: 1,
              crewId: 1,
              voteTitle: '이번 주에 만날 사람. 투표 부탁드립니다!',
              voteContent: '홍대 근처 사시는 분들 함께 달리면 좋을 것 같아요!',
              voteEndDate: '2023-08-19T03:44:19.661Z',
            },
          },
          personType: 'captain',
        },
        example3: {
          crew: {
            crew_crewId: '22',
            crew_category: '공연/축제',
            crew_crewAddress: '다대포해수욕장역 1번 출구',
            crew_crewType: '장기',
            crew_crewDDay: '2023-08-19T00:00:00.000Z',
            crew_crewMemberInfo: '털털한 분',
            crew_crewAgeInfo: '20대 초반 ~ 30대 후반',
            crew_crewSignup: 1,
            crew_crewTitle: '오늘은 뛸 수 있나?',
            crew_crewContent: '오늘 꼭 뛰고 싶은 사람들 모이세요',
            crew_thumbnail: '',
            crew_crewMaxMember: '8',
            crew_latitude: 35.047164,
            crew_longtitude: 128.967317,
            crew_createdAt: '2023-09-25T05:17:47.797Z',
            crew_deletedAt: null,
            captainId: '1',
            captainAge: 1995,
            captainLocation: '서울 종로구 서린동 136',
            captainMessage: '안녕하세요. 고양이를 키우고 있는 사람입니다.',
            captainNickname: 'CJW',
            captainProfileImage:
              'https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_1280.jpg',
            crewAttendedMember: '0',
          },
          captainTopics: [
            {
              userId: '1',
              interestTopic: '친목',
            },
            {
              userId: '1',
              interestTopic: '음료',
            },
            {
              userId: '1',
              interestTopic: '책/글',
            },
          ],
          member: [1, 11, 10],
          schedule: [
            {
              scheduleId: 1,
              userId: 3,
              scheduleTitle: '일요일 달리기!!',
              scheduleContent:
                '일요일 달리기 정모가 있습니다!! 많이 나와주세요!!',
              scheduleDDay: '2023-08-18T15:00:00.000Z',
              scheduleIsDone: 1,
              scheduleAddress: '일산 호수공원',
              scheduleMaxMember: '8',
              scheduleAttendedMember: '0',
              scheduleLatitude: 23.010203,
              scheduleLongitude: 106.102032,
              createdAt: '2023-09-22T02:32:18.356Z',
              participate: '1',
            },
          ],
          allNotice: {
            notice: {
              noticeTitle: '일산 호수공원 런닝!!',
              noticeContent:
                '일산 호수공원 저녁 8시에 런닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
              noticeAddress: '일산 호수공원',
              noticeDDay: '2023-08-19T03:44:19.661Z',
            },
            voteForm: {
              voteFormId: 1,
              crewId: 1,
              voteTitle: '이번 주에 만날 사람. 투표 부탁드립니다!',
              voteContent: '홍대 근처 사시는 분들 함께 달리면 좋을 것 같아요!',
              voteEndDate: '2023-08-19T03:44:19.661Z',
            },
          },
          personType: 'member',
        },
      },
    },
  })
  async findCrewDetail(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const user = res.locals.user ? res.locals.user : null;
      const userId = user !== null ? user.userId : 0;
      const crew = await this.crewService.findCrewDetail(crewId);

      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      const captainId = crew.captainId;
      const captainTopics = await this.topicService.findTopicById(captainId);
      const member = await this.memberService.findAllMember(crewId);
      const likeCount = await this.likeService.countLikedCrew(crewId);

      // 모임이 생긴 기간
      const today: any = new Date();
      const startDate: any = new Date(crew.crew_createdAt);
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
      const createdCrewPeriod: number = Math.floor(
        (today - startDate) / oneDayInMilliseconds,
      );

      /* userId를 통해 crew 방장 및 member 확인 */
      // 게스트일 경우
      if (userId === null) {
        return res.status(HttpStatus.OK).json({
          createdCrewPeriod,
          crew,
          captainTopics,
          member,
          personType: 'person',
        });
      }

      // crew 일정
      const schedule = await this.scheduleService.findScheduleByCrew(
        crewId,
        userId,
      );

      // crew 공지
      const regularNotice = await this.noticeService.findAllNotice(crewId);
      const voteForm = await this.voteFormService.findAllVoteForm(crewId);

      const allNotice = { regularNotice, voteForm };

      // 방장일 경우
      if (userId === crew.captainId) {
        return res.status(HttpStatus.OK).json({
          createdCrewPeriod,
          crew,
          captainTopics,
          member,
          schedule,
          allNotice,
          likeCount,
          personType: 'captain',
        });
      }
      for (let i = 0; i < member.length; i++) {
        // member일 경우
        if (userId === member[i].member_userId) {
          return res.status(HttpStatus.OK).json({
            createdCrewPeriod,
            crew,
            captainTopics,
            member,
            schedule,
            allNotice,
            likeCount,
            personType: 'member',
          });
        }
      }
      return res.status(HttpStatus.OK).json({
        createdCrewPeriod,
        crew,
        captainTopics,
        member,
        likeCount,
        personType: 'person',
      });
    } catch (e) {
      console.error(e);
      throw new Error('CrewController/findCrewDetail');
    }
  }

  /* 모임글 수정 */
  @Put(':crewId/edit')
  @ApiOperation({
    summary: '모임 글 수정 API',
    description: '모임의 상세한 내용을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 상세한 내용을 수정합니다.',
    schema: {
      example: {
        crewId: 1,
        category: '친목',
        crewTitle: '같이 운동하고 건강한 저녁 함께해요',
        thumbnail: ['url1', 'url2', 'url3'],
        crewDDay: '2023-08-19T03:44:19.661Z',
        crewAddress: '소공동',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async editCrew(
    @Param('crewId') crewId: number,
    @Body() editCrewDto: EditCrewDto,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;

    const crew = await this.crewService.findCrewForAuth(crewId);
    if (crew.userId !== userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '모임 수정 권한이 없습니다.' });
    }
    const editCrew = await this.crewService.editCrew(crewId, editCrewDto);
    if (!editCrew) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '모임 수정 실패했습니다.' });
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: '모임 수정 완료했습니다.' });
  }

  /* 모임 글 삭제 */
  @Delete(':crewId/delete')
  @ApiOperation({
    summary: '모임 글 삭제 API',
    description: '모임의 내용을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 내용을 삭제합니다.',
    schema: {
      example: {
        message: '모임 삭제 성공했습니다.',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async deleteCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;
    const crew = await this.crewService.findCrewForAuth(crewId);
    if (crew.userId !== userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '모임 삭제 권한이 없습니다.' });
    }
    const deleteCrew = await this.crewService.deleteCrew(crewId);
    if (!deleteCrew) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '모임 삭제를 실패했습니다.' });
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: '모임 삭제를 성공했습니다.' });
  }

  /* 모임장 위임하기 */
  @Post('delegate/:crewId')
  @ApiOperation({
    summary: '모임장 위임 API',
    description: '모임장을 위임합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임장 위임 성공',
  })
  @ApiBearerAuth('accessToken')
  async delegateCrew(
    @Param('crewId') crewId: number,
    @Body() delegateDto: DelegateDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const { delegator } = delegateDto;
      const crew = await this.crewService.findOneCrew(crewId, userId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      const member = await this.memberService.findAllMember(crewId);
      for (let i = 0; i < member.length; i++) {
        if (parseInt(member[i].member_userId) === delegator) {
          await this.crewService.delegateCrew(delegator, crewId, userId);
          await this.memberService.delegateMember(delegator, crewId, userId);
          await this.noticeService.delegateNotice(delegator, crewId);
          await this.scheduleService.delegateSchedule(delegator, crewId);
          await this.voteFormService.delegateVoteForm(delegator, crewId);
          return res.status(HttpStatus.OK).json({ message: '위임 완료' });
        }
      }

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'crew 멤버가 아닌 사람에게 모임장을 위임할 수 없습니다.',
      });
    } catch (e) {
      console.error(e);
      throw new Error('CrewContrller/changeCaptain');
    }
  }
}
