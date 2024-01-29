import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: '/api/auth/kakao/callback',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // profile에서 정보 추출
    const email = profile._json.kakao_account.email;
    const nickname = profile.displayName;
    const provider = 'kakao';

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
      const newUser = await this.authService.createUser({
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
