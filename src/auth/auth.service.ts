import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
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

  /* token 설정 */
  async getToken(userId: any): Promise<any> {
    // 토큰 만료 시간
    const tokenExpiry = 3600;
    // token 생성
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });
    return token;
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
