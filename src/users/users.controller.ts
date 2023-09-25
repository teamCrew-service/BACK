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
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthGuard } from 'src/auth/guard/google-auth.guard';
import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
import { NaverAuthGuard } from 'src/auth/guard/naver-auth.guard';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
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

@Controller()
@ApiTags('User API')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly crewService: CrewService,
    private readonly authService: AuthService,
    private readonly likeService: LikeService,
    private readonly memberService: MemberService,
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
      if (user.location === null) {
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_AUTH + `/${query}`);
      } else {
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
      if (user.location === null) {
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_AUTH + `/${query}`);
      } else {
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
      if (user.location === null) {
        const query = '?token=' + token;
        res.redirect(process.env.REDIRECT_URI_AUTH + `/${query}`);
      } else {
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
  @ApiBearerAuth('accessToken')
  async addUserInfo(
    @Body() topicAndInfoDto: TopicAndInfoDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      let { addUserInfoDto, topicDto } = topicAndInfoDto;
      const { userId } = res.locals.user;
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
        createdCrew: [
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
        joinedCrew: [
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
    const { userId } = res.locals.user;
    // user 정보
    const user = await this.usersService.findUserByPk(userId);
    // user 관심사
    const topic = await this.usersService.findTopicById(userId);
    // user가 만든 모임
    const createdCrew = await this.crewService.findCreatedCrew(userId);
    // user가 찜한 모임
    const likedCrew = await this.likeService.findLikedCrew(userId);
    const crewList = [];
    for (let i = 0; i < likedCrew.length; i++) {
      const crewId = likedCrew[i].like_crewId;
      const crew = await this.crewService.findCrewDetailByCrewId(crewId);
      crewList.push(crew);
    }
    // user가 참여한 모임
    const joinedCrew = await this.memberService.findJoinedCrew(userId);
    const memberCrewList = [];
    for (let i = 0; i < joinedCrew.length; i++) {
      const crewId = joinedCrew[i].member_crewId;
      const crew = await this.crewService.findCrewDetailByCrewId(crewId);
      memberCrewList.push(crew);
    }
    return res.status(HttpStatus.OK).json({
      user,
      topic,
      createdCrew,
      likedCrew: crewList,
      joinedCrew: memberCrewList,
    });
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
  @ApiBearerAuth('accessToken')
  async editMypage(
    @Body() editTopicAndInfoDto: EditTopicAndInfoDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      let { editUserInfoDto, editTopicDto } = editTopicAndInfoDto;
      const { userId } = res.locals.user;
      if (!editTopicAndInfoDto) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '수정할 내용이 없습니다.' });
      }
      await this.usersService.userInfo(editUserInfoDto, userId);
      await this.usersService.editTopic(editTopicDto, userId);
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

      if (likedCrew.length < 1) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '찜한 crew가 없습니다.' });
      }
      return res.status(HttpStatus.OK).json({ likedCrew });
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
      if (joinedCrew.length < 1) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '참여한 모임이 아직 없습니다.' });
      }

      return res.status(HttpStatus.OK).json({ joinedCrew });
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/findJoinedCrew');
    }
  }

  /* 나의 모임 */
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
  async findMyCrew(@Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const myCrew = await this.crewService.findMyCrew(userId);
      if (myCrew.length < 1) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '생성한 crew가 아직 없습니다.' });
      }
      return res.status(HttpStatus.OK).json(myCrew);
    } catch (e) {
      console.error(e);
      throw new Error('UsersController/findMyCrew');
    }
  }
}
