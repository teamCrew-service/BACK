import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /* user 정보 확인 */
  async validateUser(email: string, provider: string): Promise<any> {
    const exUser = await this.usersService.findUserByEmail(email, provider);
    if (!exUser) {
      return null;
    }
    return exUser;
  }

  /* accessToken 설정 */
  async getAccessToken(userId: any): Promise<any> {
    // 토큰 만료 시간
    const tokenExpiry = 10;
    // token 생성
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: tokenExpiry,
    });
    return accessToken;
  }

  /* refreshToken 설정 */
  async setRefreshToken(userId: any): Promise<any> {
    // 토큰 만료 시간
    const tokenExpiry = 14 * 24 * 60 * 60;
    // token 생성
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: tokenExpiry,
    });
    // db에 저장 시키기
    await this.usersService.setRefreshToken(refreshToken, userId);

    return refreshToken;
  }

  /* newUser 생성 */
  async create({ email, nickname, provider }): Promise<any> {
    const user = await this.usersService.create({
      email,
      nickname,
      provider,
    });
    return user;
  }
}
