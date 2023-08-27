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

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /* 카카오 로그인 서비스*/
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  async kakaoCallback(@Req() req: any, @Res() res: Response) {
    res.cookie('authorization', req.user);
    // res.setHeader('Set-Cookie', req.user);
    res.redirect('http://localhost:3000');
  }

  /*네이버 로그인 서비스*/
  @UseGuards(NaverAuthGuard)
  @Get('auth/naver')
  async naverLogin() {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('auth/naver/callback')
  async naverCallback(@Req() req: any, @Res() res: Response) {
    res.cookie('authorization', req.user);
    res.redirect('http://localhost:3000');
  }

  /*구글 로그인 서비스*/
  @UseGuards(GoogleAuthGuard)
  @Get('auth/google')
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('auth/google/callback')
  async googleCallback(@Req() req: any, @Res() res: Response) {
    res.cookie('authorization', req.user);
    res.redirect('http://localhost:3000');
  }

  /*최초 로그인 설정*/
  @Put('auth/info')
  async addUserInfo(
    @Body() addUserInfoDto: AddUserInfoDto,
    @Res() res: any,
    @Req() req: any,
  ): Promise<any> {
    await this.userService.addUserInfo(addUserInfoDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: '추가 정보 입력 완료' });
  }
}
