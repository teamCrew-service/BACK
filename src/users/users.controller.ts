import { Controller, Res, Req, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { GoogleAuthGuard } from 'src/auth/guard/google-auth.guard';
import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
import { NaverAuthGuard } from 'src/auth/guard/naver-auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  /* 카카오 로그인 서비스*/
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao/callback')
  async kakaoCallback(@Req() req: any, @Res() res: Response) {
    // res.cookie('authorization', req.user);
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
    res.redirect('http://localhost:3000');
  }
}
