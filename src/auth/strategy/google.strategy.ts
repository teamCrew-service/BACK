import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // profile에서 정보 추출
    const email = profile._json.email;
    const nickname = profile._json.name;
    const provider = profile.provider;

    /* user 정보 확인 */
    // 기존 user 정보 확인
    const exUser = await this.authService.validateUser(email, provider);
    if (exUser) {
      // user 정보에 맞춰 token 발행
      const accessToken = await this.authService.getAccessToken(exUser.userId);
      const refreshToken = await this.authService.setRefreshToken(
        exUser.userId,
      );
      return { accessToken, refreshToken, userId: exUser.userId };
    }
    // user 정보가 없을 경우 새로운 user db에 저장
    if (exUser === null) {
      const newUser = await this.authService.create({
        email,
        nickname,
        provider,
      });
      // user 정보에 맞춰 token 발행
      const accessToken = await this.authService.getAccessToken(newUser.userId);
      const refreshToken = await this.authService.setRefreshToken(
        newUser.userId,
      );
      return { accessToken, refreshToken, userId: newUser.userId };
    }
  }
}
