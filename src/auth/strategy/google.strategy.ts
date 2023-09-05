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

    // user 정보 확인
    const exUser = await this.authService.validateUser(email);
    if (exUser) {
      const token = await this.authService.getToken(exUser.userId);
      return token;
    }
    if (exUser === null) {
      const user = await this.authService.create({ email, nickname, provider });
      const token = await this.authService.getToken(exUser.userId);
      return token;
    }
  }
}
