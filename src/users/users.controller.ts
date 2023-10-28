import {
  Controller,
  Res,
  Req,
  Get,
  UseGuards,
  Put,
  Post,
  Body,
  HttpStatus,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthGuard } from 'src/auth/guard/google-auth.guard';
import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
import { NaverAuthGuard } from 'src/auth/guard/naver-auth.guard';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { CrewService } from 'src/crew/crew.service';
import { TestLoginDto } from './dto/testLogin-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CheckNicknameDto } from './dto/checkNickname-user.dto';
import { TopicAndInfoDto } from './dto/topicAndInfo-user.dto';
import { LikeService } from 'src/like/like.service';
import { MemberService } from 'src/member/member.service';
import { EditTopicAndInfoDto } from './dto/editTopicAndInfo-user.dto';
import { SignupService } from 'src/signup/signup.service';
import { UnsubscribeService } from 'src/unsubscribe/unsubscribe.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/crew/multerConfig';
import { IsOptional } from 'class-validator';
export class UserFirstUploadDto {
  @ApiProperty()
  topicAndInfoDto: TopicAndInfoDto;
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

export class UserEditUploadDto {
  @ApiProperty()
  editTopicAndInfoDto: EditTopicAndInfoDto;
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

@Controller()
@ApiTags('User API')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly crewService: CrewService,
    private readonly authService: AuthService,
    private readonly likeService: LikeService,
    private readonly memberService: MemberService,
    private readonly signupService: SignupService,
    private readonly unsubscribeService: UnsubscribeService,
    private readonly scheduleService: ScheduleService,
  ) {}

  /* 카카오 로그인 서비스*/
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  @ApiOperation({
    summary: '카카오 소셜로그인 API',
    description: '카카오 소셜로그인을 통한 서비스 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '카카오 소셜로그인을 통한 서비스 로그인',
  })
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  @ApiOperation({
    summary: '카카오 소셜로그인 callback API',
    description: '카카오 소셜로그인을 통한 서비스 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '카카오 소셜로그인을 통한 서비스 로그인',
  })
  async kakaoCallback(@Req() req: any, @Res() res: Response) {
    // res.cookie('authorization', `Bearer ${req.user}`);
    try {
      const token = req.user.token;
      const userId = req.user.userId;
      const user = await this.usersService.findUserByPk(userId);
      // const unsubscribe = await this.unsubscribeService.findOneUnsubscribe(
      //   userId,
      // );
      if (user.location === null) {
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_AUTH + `/${query}`);
      } else {
        // if (unsubscribe) {
        //   const query = '?token=' + token;
        //   res.redirect()
        // }
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_HOME + `/${query}`);
      }
    } catch (e) {
      console.error(e);
      throw new Error('kakao 로그인 error');
    }
  }

  /*네이버 로그인 서비스*/
  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  @ApiOperation({
    summary: '네이버 소셜로그인 API',
    description: '네이버 소셜로그인을 통한 서비스 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '네이버 소셜로그인을 통한 서비스 로그인',
  })
  async naverLogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  @ApiOperation({
    summary: '네이버 소셜로그인 callback API',
    description: '네이버 소셜로그인을 통한 서비스 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '네이버 소셜로그인을 통한 서비스 로그인',
  })
  async naverCallback(@Req() req: any, @Res() res: Response) {
    // res.cookie('authorization', `Bearer ${req.user}`);
    try {
      const token = req.user.token;
      const userId = req.user.userId;
      const user = await this.usersService.findUserByPk(userId);
      // const unsubscribe = await this.unsubscribeService.findOneUnsubscribe(
      //   userId,
      // );
      if (user.location === null) {
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_AUTH + `/${query}`);
      } else {
        // if (unsubscribe) {
        //   const query = '?token=' + token;
        //   res.redirect()
        // }
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_HOME + `/${query}`);
      }
    } catch (e) {
      console.error(e);
      throw new Error('kakao 로그인 error');
    }
  }

  /*구글 로그인 서비스*/
  @UseGuards(GoogleAuthGuard)
  @Get('auth/google')
  @ApiOperation({
    summary: '구글 소셜로그인 API',
    description: '구글 소셜로그인을 통한 서비스 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '구글 소셜로그인을 통한 서비스 로그인',
  })
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('auth/google/callback')
  @ApiOperation({
    summary: '구글 소셜로그인 callback API',
    description: '구글 소셜로그인을 통한 서비스 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '구글 소셜로그인을 통한 서비스 로그인',
  })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    try {
      const token = req.user.token;
      const userId = req.user.userId;
      const user = await this.usersService.findUserByPk(userId);
      // const unsubscribe = await this.unsubscribeService.findOneUnsubscribe(
      //   userId,
      // );
      if (user.location === null) {
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_AUTH + `/${query}`);
      } else {
        // if (unsubscribe) {
        //   const query = '?token=' + token;
        //   res.redirect()
        // }
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_HOME + `/${query}`);
      }
    } catch (e) {
      console.error(e);
      throw new Error('Google 로그인 error');
    }
  }

  /* 테스트용 로그인 API */
  @Post('login')
  async testLogin(
    @Body() testLoginDto: TestLoginDto,
    @Res() res: any,
  ): Promise<any> {
    const email = testLoginDto.email;
    const provider = testLoginDto.provider;
    const user = await this.usersService.findUserByEmail(email, provider);
    const userId = user.userId;
    const token = await this.authService.getToken(userId);
    res.cookie('authorization', `Bearer ${token}`);
    return res.status(HttpStatus.OK).json({ message: '로그인 성공' });
  }

  /*최초 로그인 설정*/
  @Put('auth/info')
  @ApiOperation({
    summary: '최초 로그인 설정 API',
    description: '유저의 추가 정보를 입력하는 API',
  })
  @ApiResponse({
    status: 201,
    description: '추가 정보 입력 완료',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
    type: UserFirstUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', 1, multerConfig('profile')))
  @ApiBearerAuth('accessToken')
  async addUserInfo(
    @Body('topicAndInfoDto') topicAndInfoDto: any,
    @UploadedFiles() files,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { addUserInfoDto, topicDto } = JSON.parse(topicAndInfoDto);
      const { userId } = res.locals.user;
      //files가 비어있으면 실행안함
      if (files.length > 0) {
        const profileImage = files[0].location;
        addUserInfoDto.profileImage = profileImage;
      }
      await this.usersService.userInfo(addUserInfoDto, userId);
      await this.usersService.addTopic(topicDto, userId);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: '추가 정보 입력 완료' });
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/addUserInfo');
    }
  }

  /* 닉네임 체크 API */
  @Post('nickname')
  @ApiOperation({
    summary: '닉네임 중복 체크',
    description: '유저의 닉네임이 중복되지 않게 체크하는 API',
  })
  @ApiResponse({
    status: 200,
    description: '닉네임 중복확인 완료',
  })
  async checkNickname(
    @Body() checkNicknameDto: CheckNicknameDto,
    @Res() res: any,
  ) {
    try {
      const newNickname = checkNicknameDto.nickname;
      const exNickname = await this.usersService.checkNickname(newNickname);
      if (newNickname === exNickname) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '중복된 닉네임입니다.' });
      } else {
        return res
          .status(HttpStatus.OK)
          .json({ message: '중복된 닉네임이 없습니다.' });
      }
    } catch (e) {
      console.error(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '닉네임 중복 체크 실패' });
    }
  }

  /* 로그아웃 */
  @Get('auth/logout')
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃 API',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 완료',
  })
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('authorization');
    return res.status(HttpStatus.OK).json({ message: '로그아웃 성공' });
  }

  /* 마이페이지 */
  @Get('mypage')
  @ApiOperation({
    summary: '마이페이지 API',
    description: '마이페이지 API',
  })
  @ApiResponse({
    status: 200,
    description: '마이페이지에 관련된 정보를 조회',
    schema: {
      example: {
        user: {
          userId: 1,
          provider: 'kakao',
          location: '운정역',
          email: 'asdf@asdf.com',
          nickname: '돌핀맨',
          age: 20,
          gender: '남자',
          profileImage: 'URL',
          myMessage: '돌고래 짱짱맨',
        },
        topic: [
          { userId: 1, interestTopic: '친목' },
          { userId: 1, interestTopic: '여행' },
        ],
        likedCrew: [
          {
            crewId: 1,
            category: '여행',
            crewType: '단기',
            crewAddress: '김포공항',
            crewTitle: '제주도로 같이 여행 떠나요~~',
          },
          {
            crewId: 6,
            category: '자기 개발',
            crewType: '장기',
            crewAddress: '백석역',
            crewTitle: '영어 스터디 모임',
          },
        ],
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async mypage(@Res() res: Response): Promise<any> {
    try {
      const { userId } = res.locals.user;
      // user 정보
      const user = await this.usersService.findUserByPk(userId);
      // user 관심사
      const topic = await this.usersService.findTopicById(userId);
      // user가 찜한 모임
      const likedCrew = await this.likeService.findLikedCrew(userId);
      const crewList = [];
      for (let i = 0; i < likedCrew.length; i++) {
        const crewId = likedCrew[i].crew_crewId;
        const crew = await this.crewService.findCrewDetailByCrewId(crewId);
        crewList.push(crew);
      }

      for (let i = 0; i < crewList.length; i++) {
        if (crewList[i].crew_crewDDay === null) {
          const crewId = parseInt(crewList[i].crew_crewId);
          const schedule = await this.scheduleService.findScheduleCloseToToday(
            crewId,
          );
          if (schedule) {
            crewList[i].crew_crewDDay = schedule.scheduleDDay;
          }
        }
      }

      return res.status(HttpStatus.OK).json({
        user,
        topic,
        likedCrew: crewList,
      });
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/mypage');
    }
  }

  /* 마이페이지 edit */
  @Put('mypage/edit')
  @ApiOperation({
    summary: '마이페이지 유저 정보 수정 API',
    description: '유저의 정보를 수정하는 API',
  })
  @ApiResponse({
    status: 201,
    description: '유저 정보 수정 완료',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
    type: UserEditUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', 1, multerConfig('profile')))
  @ApiBearerAuth('accessToken')
  async editMypage(
    @Body('editTopicAndInfoDto') editTopicAndInfoDto: any,
    @UploadedFiles() files,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { editUserInfoDto, editTopicDto } = JSON.parse(editTopicAndInfoDto);
      const { userId } = res.locals.user;

      if (!editTopicAndInfoDto) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '수정할 내용이 없습니다.' });
      }
      //files가 비어있으면 실행안함
      if (files.length > 0) {
        const profileImage = files[0].location;
        editUserInfoDto.profileImage = profileImage;
      }
      await this.usersService.userInfo(editUserInfoDto, userId);
      if (editTopicDto.interestTopic) {
        await this.usersService.editTopic(editTopicDto, userId);
      }
      return res.status(HttpStatus.OK).json({ message: '유저 정보 수정 완료' });
    } catch (e) {
      console.error(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '유저 정보 수정 실패' });
    }
  }

  /* 내가 찜한 모임 */
  @Get('mycrew/likedcrew')
  @ApiOperation({
    summary: '내가 찜한 모임 API',
    description: 'user가 찜한 모임 조회 API',
  })
  @ApiResponse({
    status: 200,
    description: '내가 찜한 모임의 정보를 조회',
    schema: {
      example: {
        likedCrew: [
          {
            like_likeId: 1,
            like_crewId: 1,
            crew_category: '여행',
            crew_crewType: '단기',
            crew_crewAddress: '김포공항',
            crew_crewTitle: '제주도로 같이 여행 떠나요~~',
            crew_crewMaxMember: 8,
            crewAttendedMember: '3',
            crew_thumbnail: 'url',
          },
          {
            like_likeId: 2,
            like_crewId: 2,
            crew_category: '자기 개발',
            crew_crewType: '장기',
            crew_crewAddress: '백석역',
            crew_crewTitle: '영어 스터디 모임',
            crew_crewMaxMember: 8,
            crewAttendedMember: '3',
            crew_thumbnail: 'url',
          },
        ],
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findLikedCrew(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const likedCrew = await this.likeService.findLikedCrew(userId);

      return res.status(HttpStatus.OK).json(likedCrew);
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/findLikedCrew');
    }
  }

  /* 내가 참여한 모임 */
  @Get('mycrew/joinedcrew')
  @ApiOperation({
    summary: '내가 참여한 모임 API',
    description: 'user가 참여한 모임 조회',
  })
  @ApiResponse({
    status: 200,
    description: '내가 참여한 모임의 정보를 조회',
    schema: {
      example: {
        joinedCrew: [
          {
            member_likeId: 1,
            member_crewId: 1,
            crew_category: '여행',
            crew_crewType: '단기',
            crew_crewAddress: '김포공항',
            crew_crewTitle: '제주도로 같이 여행 떠나요~~',
            crew_crewMaxMember: 8,
            crewAttendedMember: '3',
            crew_thumbnail: 'url',
          },
          {
            member_likeId: 2,
            member_crewId: 2,
            crew_category: '자기 개발',
            crew_crewType: '장기',
            crew_crewAddress: '백석역',
            crew_crewTitle: '영어 스터디 모임',
            crew_crewMaxMember: 8,
            crewAttendedMember: '3',
            crew_thumbnail: 'url',
          },
        ],
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findJoinedCrew(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      // user가 참여한 모임
      const joinedCrew = await this.memberService.findJoinedCrew(userId);

      for (let i = 0; i < joinedCrew.length; i++) {
        if (joinedCrew[i].crew_crewDDay === null) {
          const crewId = parseInt(joinedCrew[i].crew_crewId);
          const schedule = await this.scheduleService.findScheduleCloseToToday(
            crewId,
          );
          if (schedule) {
            joinedCrew[i].crew_crewDDay = schedule.scheduleDDay;
          }
        }
      }

      return res.status(HttpStatus.OK).json(joinedCrew);
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/findJoinedCrew');
    }
  }

  /* 내가 만든 모임 */
  @Get('mycrew/mycreatedcrew')
  @ApiOperation({
    summary: '내가 생성한 모임 조회 API',
    description: 'user가 생성한 모임 조회',
  })
  @ApiResponse({
    status: 200,
    description: '내가 생성한 모임의 정보를 조회',
    schema: {
      example: {
        myCrew: [
          {
            member_likeId: 1,
            member_crewId: 1,
            crew_category: '여행',
            crew_crewType: '단기',
            crew_crewAddress: '김포공항',
            crew_crewTitle: '제주도로 같이 여행 떠나요~~',
            crew_crewMaxMember: 8,
            crewAttendedMember: '3',
            crew_thumbnail: 'url',
            existSignup: '0',
          },
          {
            member_likeId: 2,
            member_crewId: 2,
            crew_category: '자기 개발',
            crew_crewType: '장기',
            crew_crewAddress: '백석역',
            crew_crewTitle: '영어 스터디 모임',
            crew_crewMaxMember: 8,
            crewAttendedMember: '3',
            crew_thumbnail: 'url',
            existSignup: '0',
          },
        ],
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findMyCrew(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const myCrew = await this.crewService.findMyCrew(userId);

      for (let i = 0; i < myCrew.length; i++) {
        if (myCrew[i].crew_crewDDay === null) {
          const crewId = parseInt(myCrew[i].crew_crewId);
          const schedule = await this.scheduleService.findScheduleCloseToToday(
            crewId,
          );
          if (schedule) {
            myCrew[i].crew_crewDDay = schedule.scheduleDDay;
          }
        }
      }

      return res.status(HttpStatus.OK).json(myCrew);
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/findMyCrew');
    }
  }

  /* 대기 중인 모임 */
  @Get('mycrew/waitingcrew')
  @ApiOperation({
    summary: '승인을 기다리는 모임 조회 API',
    description: 'user가 signup한 모임 조회',
  })
  @ApiResponse({
    status: 200,
    description: '내가 signup한 모임의 정보를 조회',
    schema: {
      example: {
        waitingCrew: [
          {
            crew_crewId: '35',
            crew_userId: '3',
            crew_category: '운동',
            crew_crewType: '번개',
            crew_crewAddress: '홍대입구역 1번 출구',
            crew_crewTitle: '오늘은 꼭 뛰어야 한다!!',
            crew_crewContent: '오늘 꼭 뛰고 싶은 사람들 모이세요',
            crew_crewMaxMember: '8',
            crew_crewAttendedMember: '0',
            crew_thumbnail:
              'https://team-crew-bucket.s3.ap-northeast-2.amazonaws.com/%EC%98%A4%EB%8A%98%EC%9D%80%20%EA%BC%AD%20%EB%9B%B0%EC%96%B4%EC%95%BC%20%ED%95%9C%EB%8B%A4%21%21-1696316103572',
          },
        ],
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async waitingCrew(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const allSignup = await this.signupService.findMyAllSignup(userId);

      const waitingCrew = [];
      for (let i = 0; i < allSignup.length; i++) {
        const crewId = parseInt(allSignup[i].crewId);
        const crew = await this.crewService.findWaitingPermission(crewId);
        waitingCrew.push(crew);
      }

      for (let i = 0; i < waitingCrew.length; i++) {
        if (waitingCrew[i].crew_crewDDay === null) {
          const crewId = parseInt(waitingCrew[i].crew_crewId);
          const schedule = await this.scheduleService.findScheduleCloseToToday(
            crewId,
          );
          if (schedule) {
            waitingCrew[i].crew_crewDDay = schedule.scheduleDDay;
          }
        }
      }

      return res.status(HttpStatus.OK).json(waitingCrew);
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/waitingCrew');
    }
  }

  /* 탈퇴 대기 등록 */
  @Post('unsubscribe')
  @ApiOperation({
    summary: '탈퇴 대기하기 API',
    description: '계정 탈퇴를 위한 대기 등록 API',
  })
  @ApiResponse({
    status: 200,
    description: '탈퇴 대기 성공',
  })
  @ApiBearerAuth('accesssToken')
  async unsubscribe(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crewList = await this.crewService.findMyCrew(userId);
      if (crewList > 0) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '모임장 위임을 하지 않은 crew가 있습니다.' });
      }
      const toBeDeletedAccount =
        await this.unsubscribeService.findOneUnsubscribe(userId);
      if (!toBeDeletedAccount) {
        await this.unsubscribeService.createUnsubscribe(userId);
        return res.status(HttpStatus.OK).json({ message: '탈퇴 대기 성공' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/deleteAccount');
    }
  }

  /* 탈퇴 대기 취소 */
  @Delete('deleteUnsubscribe')
  @ApiOperation({
    summary: '탈퇴 대기 취소하기 API',
    description: '계정 탈퇴를 위한 대기 취소 API',
  })
  @ApiResponse({
    status: 200,
    description: '탈퇴 취소 성공',
  })
  @ApiBearerAuth('accesssToken')
  async deleteUnsubscribe(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const toBeDeletedAccount =
        await this.unsubscribeService.findOneUnsubscribe(userId);
      if (toBeDeletedAccount) {
        await this.unsubscribeService.deleteUnsubscribe(userId);
      }
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/deleteUnsubscribe');
    }
  }
}
