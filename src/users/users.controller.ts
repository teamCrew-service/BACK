import {
  Controller,
  Res,
  Req,
  Get,
  UseGuards,
  Put,
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
import { TopicDto } from './dto/topic-user.dto';

@Controller()
@ApiTags('User API')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
    res.cookie('authorization', req.user);
    // res.setHeader('Set-Cookie', req.user);
    res.redirect('http://localhost:3000');
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
    res.cookie('authorization', req.user);
    res.redirect('http://localhost:3000');
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
    res.cookie('authorization', req.user);
    res.redirect('http://localhost:3000');
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
    @Body() addUserInfoDto: AddUserInfoDto,
    @Body() topicDto: TopicDto,
    @Res() res: any,
  ): Promise<any> {
    await this.userService.addUserInfo(addUserInfoDto);
    await this.userService.addTopic(topicDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: '추가 정보 입력 완료' });
  }

  /* 로그아웃 */
  @Get('auth/logout')
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('authorization');
    return res.status(HttpStatus.OK).json({ message: '로그아웃 성공' });
  }
}
