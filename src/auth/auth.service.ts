import { Injectable } from '@nestjs/common';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';
import { Users } from '@src/users/entities/user.entity';
import { UsersService } from '@src/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private usersService: UsersService,
  ) {}

  /* user 정보 확인 */
  async validateUser(email: string, provider: string): Promise<Users | null> {
    try {
      const exUser = await this.usersService.findUserByEmail(email, provider);
      if (!exUser) {
        return null;
      }
      return exUser;
    } catch (e) {
      this.errorHandlingService.handleException('AuthService/validateUser', e);
    }
  }

  /* token 설정 */
  async getToken(userId: any): Promise<string> {
    try {
      // 토큰 만료 시간
      const tokenExpiry = 3600;
      // token 생성
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry,
      });
      return token;
    } catch (e) {
      this.errorHandlingService.handleException('AuthService/getToken', e);
    }
  }

  /* newUser 생성 */
  async createUser({ email, nickname, provider }): Promise<Users> {
    try {
      const user = await this.usersService.createUser({
        email,
        nickname,
        provider,
      });
      return user;
    } catch (e) {
      this.errorHandlingService.handleException('AuthService/createUser', e);
    }
  }
}
