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
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { TopicDto } from '../topic/dto/topic.dto';
import { CrewService } from 'src/crew/crew.service';
import { TestLoginDto } from './dto/testLogin-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CheckNicknameDto } from './dto/checkNickname-user.dto';
import { TopicAndInfoDto } from './dto/topicAndInfo-user.dto';
import { LikeService } from 'src/like/like.service';
import { MemberService } from 'src/member/member.service';

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
  async addUserInfo(
    @Body() topicAndInfoDto: TopicAndInfoDto,
    @Res() res: any,
  ): Promise<any> {
    let { addUserInfoDto, topicDto } = topicAndInfoDto;
    const { userId } = res.locals.user;
    await this.usersService.userInfo(addUserInfoDto, userId);
    await this.usersService.addTopic(topicDto, userId);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: '추가 정보 입력 완료' });
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
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('authorization');
    return res.status(HttpStatus.OK).json({ message: '로그아웃 성공' });
  }

  /* 마이페이지 */
  @Get('mypage')
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
      const crewId = likedCrew[i].crewId;
      const crew = await this.crewService.findByCrewId(crewId);
      crewList.push(crew);
    }
    // user가 참여한 모임
    const joinedCrew = await this.memberService.findJoinedCrew(userId);
    const memberCrewList = [];
    for (let i = 0; i < joinedCrew.length; i++) {
      const crewId = joinedCrew[i].crewId;
      const crew = await this.crewService.findByCrewId(crewId);
      memberCrewList.push(crew);
    }
    return res.status(HttpStatus.OK).json({
      user,
      createdCrew,
      topic,
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
  async editMypage(
    @Body() topicAndInfoDto: TopicAndInfoDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      let { addUserInfoDto, topicDto } = topicAndInfoDto;
      const { userId } = res.locals.user;
      await this.usersService.userInfo(addUserInfoDto, userId);
      await this.usersService.editTopic(topicDto, userId);
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
  async findLikedCrew(@Res() res: any): Promise<any> {
    const { userId } = res.locals.user;
    const likedCrew = await this.likeService.findLikedCrew(userId);
    const crewList = [];
    for (let i = 0; i < likedCrew.length; i++) {
      const crewId = likedCrew[i].crewId;
      const crew = await this.crewService.findByCrewId(crewId);
      crewList.push(crew);
    }

    return res.status(HttpStatus.OK).json({ likedCrew: crewList });
  }

  /* 내가 참여한 모임 */
  @Get('mycrew/joinedcrew')
  async findJoinedCrew(@Res() res: any): Promise<any> {
    const { userId } = res.locals.user;
    // user가 참여한 모임
    const joinedCrew = await this.memberService.findJoinedCrew(userId);
    const memberCrewList = [];
    for (let i = 0; i < joinedCrew.length; i++) {
      const crewId = joinedCrew[i].crewId;
      const crew = await this.crewService.findByCrewId(crewId);
      memberCrewList.push(crew);
    }
    return res.status(HttpStatus.OK).json({ joinedCrew: memberCrewList });
  }
}
