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
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfigThumbnail } from 'src/crew/multerConfig';
import { multerConfigImage } from 'src/crew/multerConfig';
import { multerConfig } from 'src/crew/multerConfig';
import { TopicService } from 'src/topic/topic.service';
import { DelegateDto } from './dto/delegate.dto';
import { IsOptional } from 'class-validator';
import { LeavecrewService } from 'src/leavecrew/leavecrew.service';
import { ParticipantService } from 'src/participant/participant.service';
import { VoteService } from 'src/vote/vote.service';

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
    required: false,
  })
  @IsOptional()
  files?: any[];
}

export class CrewFilesEditDto {
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
    private readonly leavecrewService: LeavecrewService,
    private readonly participantService: ParticipantService,
    private readonly voteService: VoteService,
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
  @UseInterceptors(FilesInterceptor('files', 1, multerConfig('thumbnail')))
  @ApiBearerAuth('accessToken')
  async createCrew(
    @UploadedFiles() files,
    @Body('JoinCreateCrewDto') joinCreateCrewDto: any,
    @Res() res: any,
  ): Promise<any> {
    //console.log(joinCreateCrewDto);
    //joinCreateCrewDto = JSON.parse(joinCreateCrewDto);
    const { createCrewDto, createSignupFormDto } =
      JSON.parse(joinCreateCrewDto);
    const { userId } = res.locals.user;
    //thumbnail 을 aws3에 업로드하고 그 url을 받아온다.
    //const filename = `${createCrewDto.crewTitle}-${Date.now()}`; // 파일명 중복 방지
    //const thumbnail = await this.imageService.urlToS3(createCrewDto.thumbnail,filename,);
    //console.log(files);
    const s3Url = files == '' ? null : files[0].location;
    createCrewDto.thumbnail = s3Url;
    //createCrewDto.thumbnail = 'thumbnail_temp';

    const newCrew = await this.crewService.createCrew(createCrewDto, userId);

    // 새로운 모임 생성할 때 crewSignup이 true일 경우 signupForm을 생성해준다.
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
    content: {
      'application/json': {
        examples: {
          person: {
            value: {
              crew: {
                crew_crewId: '22',
                crew_category: '공연/축제',
                crew_crewAddress: '다대포해수욕장역 1번 출구',
                crew_crewPlaceName: '고양체육관',
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
          },
          captain: {
            value: {
              crew: {
                crew_crewId: '22',
                crew_category: '공연/축제',
                crew_crewAddress: '다대포해수욕장역 1번 출구',
                crew_crewPlaceName: '고양체육관',
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
                  schedulePlaceName: '고양체육관',
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
                  noticeTitle: '일산 호수공원 러닝!!',
                  noticeContent:
                    '일산 호수공원 저녁 8시에 러닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
                  noticeAddress: '일산 호수공원',
                  noticeDDay: '2023-08-19T03:44:19.661Z',
                },
                voteForm: {
                  voteFormId: 1,
                  crewId: 1,
                  voteTitle: '이번 주에 만날 사람. 투표 부탁드립니다!',
                  voteContent:
                    '홍대 근처 사시는 분들 함께 달리면 좋을 것 같아요!',
                  voteEndDate: '2023-08-19T03:44:19.661Z',
                },
              },
              personType: 'captain',
            },
          },
          member: {
            value: {
              crew: {
                crew_crewId: '22',
                crew_category: '공연/축제',
                crew_crewAddress: '다대포해수욕장역 1번 출구',
                crew_crewPlaceName: '고양체육관',
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
                  schedulePlaceName: '고양체육관',
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
                  noticeTitle: '일산 호수공원 러닝!!',
                  noticeContent:
                    '일산 호수공원 저녁 8시에 러닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
                  noticeAddress: '일산 호수공원',
                  noticeDDay: '2023-08-19T03:44:19.661Z',
                },
                voteForm: {
                  voteFormId: 1,
                  crewId: 1,
                  voteTitle: '이번 주에 만날 사람. 투표 부탁드립니다!',
                  voteContent:
                    '홍대 근처 사시는 분들 함께 달리면 좋을 것 같아요!',
                  voteEndDate: '2023-08-19T03:44:19.661Z',
                },
              },
              personType: 'member',
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findCrewDetail(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const user = res.locals.user ? res.locals.user : null;
      const userId = user !== null ? user.userId : 0;
      const crew = await this.crewService.findCrewDetail(crewId);

      if (crew.crew_crewId === null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      const captainId = crew.captainId;
      const captainTopics = await this.topicService.findTopicById(captainId);
      const member = await this.memberService.findAllMember(crewId);
      const likeCount = await this.likeService.countLikedCrew(crewId);
      const crewLiked = await this.likeService.confirmLiked(crewId, userId);
      let likeCheck = false;
      !crewLiked ? (likeCheck = false) : (likeCheck = true);

      // 모임이 생긴 기간
      const currentDate: any = new Date();
      const koreaTimezoneOffset = 9 * 60;
      const today: any = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
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
          myUserId: userId,
        });
      }

      // crew 일정
      const schedule = await this.scheduleService.findScheduleByCrew(
        crewId,
        userId,
      );

      // crew 공지
      const regularNotice = await this.noticeService.findAllNotice(crewId);
      const voteForm = await this.voteFormService.findAllVoteForm(
        crewId,
        userId,
      );

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
          likeCheck,
          personType: 'captain',
          myUserId: userId,
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
            likeCheck,
            personType: 'member',
            myUserId: userId,
          });
        }
      }
      return res.status(HttpStatus.OK).json({
        createdCrewPeriod,
        crew,
        captainTopics,
        member,
        likeCount,
        likeCheck,
        personType: 'person',
        myUserId: userId,
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
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
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
        crewPlaceName: '고양체육관',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async editCrew(
    @Param('crewId') crewId: number,
    @Body() editCrewDto: EditCrewDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      // 토큰을 통해 userId 확인
      const { userId } = res.locals.user;

      // 모임 조회
      const crew = await this.crewService.findCrewForAuth(crewId);
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '모임 수정 권한이 없습니다.' });
      }
      // 권한이 있을 경우 모임 수정
      const editCrew = await this.crewService.editCrew(crewId, editCrewDto);
      if (!editCrew) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '모임 수정 실패했습니다.' });
      }
      return res
        .status(HttpStatus.OK)
        .json({ message: '모임 수정 완료했습니다.' });
    } catch (e) {
      console.error(e);
      throw new Error('CrewController/editCrew');
    }
  }

  /* 모임 Thumbnail 수정 */
  @Put(':crewId/editThumbnail')
  @ApiOperation({
    summary: '모임 Thumbnail 수정 API',
    description: '모임의 Thumbnail을 수정합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 Thumbnail을 수정합니다.',
    schema: {
      example: {
        crewId: 1,
        thumbnail: 's3_url1',
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
    type: CrewFilesEditDto,
  })
  @UseInterceptors(FilesInterceptor('files', 1, multerConfigThumbnail))
  @ApiBearerAuth('accessToken')
  async editThumbnail(
    @Param('crewId') crewId: number,
    @UploadedFiles() files,
    @Res() res: any,
  ): Promise<any> {
    try {
      // 토큰을 통해 userId 확인
      const { userId } = res.locals.user;

      // 모임 조회
      const crew = await this.crewService.findCrewForAuth(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }

      // 권한 확인
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '모임 Thumbnail 수정 권한이 없습니다.' });
      }
      // 권한이 있을 경우 thumbnail 수정
      const editThumbnail = await this.crewService.editThumbnail(
        crewId,
        files[0].location,
      );

      if (!editThumbnail) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '모임 Thumbnail 수정 실패했습니다.' });
      }
      return res
        .status(HttpStatus.OK)
        .json({ message: '모임 Thumbnail 수정 완료했습니다.' });
    } catch (e) {
      console.error(e);
      throw new Error('CrewController/editThumbnail');
    }
  }

  /* 모임 글 삭제 */
  @Delete(':crewId/delete')
  @ApiOperation({
    summary: '모임 글 삭제 API',
    description: '모임의 내용을 삭제합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
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
    try {
      // 토큰을 통해 userId 확인
      const { userId } = res.locals.user;

      // 모임 조회
      const crew = await this.crewService.findCrewForAuth(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      // 권한 확인
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '모임 삭제 권한이 없습니다.' });
      }

      // crew에 해당하는 모든 부분 삭제 처리
      const deleteCrew = await Promise.all([
        this.crewService.deleteCrew(crewId),
        this.memberService.deleteMember(crewId),
        this.likeService.deleteLike(crewId),
        this.noticeService.deleteNoticeByCrew(crewId),
        this.participantService.deleteParticipant(crewId),
        this.scheduleService.deleteScheduleByCrew(crewId),
        this.signupService.deleteSignupAndSignupForm(crewId),
        this.voteFormService.deleteVoteFormByCrew(crewId),
        this.voteService.deleteVoteByCrew(crewId),
      ]);
      if (!deleteCrew) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '모임 삭제를 실패했습니다.' });
      } else {
        return res
          .status(HttpStatus.OK)
          .json({ message: '모임 삭제를 성공했습니다.' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('CrewController/deleteCrew');
    }
  }

  /* 모임장 위임하기 */
  @Post('delegate/:crewId')
  @ApiOperation({
    summary: '모임장 위임 API',
    description: '모임장을 위임합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
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
      // 토큰을 통해 userId 확인
      const { userId } = res.locals.user;
      const { delegator } = delegateDto;

      // 모임 조회
      const crew = await this.crewService.findOneCrew(crewId, userId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }

      // member 확인, 확인 후 member일 경우에 위임 실행
      const member = await this.memberService.findAllMember(crewId);
      for (let i = 0; i < member.length; i++) {
        if (parseInt(member[i].member_userId) === delegator) {
          await Promise.all([
            this.crewService.delegateCrew(delegator, crewId, userId),
            this.memberService.delegateMember(delegator, crewId, userId),
            this.noticeService.delegateNotice(delegator, crewId),
            this.scheduleService.delegateSchedule(delegator, crewId),
            this.voteFormService.delegateVoteForm(delegator, crewId),
          ]);
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

  /* member가 모임 탈퇴 */
  @Post('leaveCrew/:crewId')
  @ApiOperation({
    summary: '모임 탈퇴 API',
    description: '모임을 탈퇴합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 200,
    description: '모임 탈퇴 성공',
  })
  @ApiBearerAuth('accessToken')
  async leaveCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      // 토큰을 통해 userId 확인
      const { userId } = res.locals.user;
      const leaveUser = await this.leavecrewService.findOneLeaveUser(
        crewId,
        userId,
      );
      if (!leaveUser) {
        await this.memberService.exitCrew(crewId, userId);
        await this.leavecrewService.createLeaveCrew(crewId, userId);
      }
    } catch (e) {
      console.error(e);
      throw new Error('CrewController/leaveCrew');
    }
  }
}
