import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: '/api/auth/naver/callback',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // profile에서 정보 추출
    const email = profile.email;
    const nickname = profile.name;
    const provider = profile.provider;

    /* user 정보 확인 */
    // 기존 user 정보 확인
    const exUser = await this.authService.validateUser(email, provider);
    if (exUser) {
      // user 정보에 맞춰 token 발행
      const token = await this.authService.getToken(exUser.userId);
      return { token, userId: exUser.userId };
    }
    // user 정보가 없을 경우 새로운 user db에 저장
    if (exUser === null) {
      const newUser = await this.authService.create({
        email,
        nickname,
        provider,
      });
      // user 정보에 맞춰 token 발행
      const token = await this.authService.getToken(newUser.userId);
      return { token, userId: newUser.userId };
    }
  }
}
