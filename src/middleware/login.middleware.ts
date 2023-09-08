import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LoginMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationCookies = req.cookies.authorization;
      const authorizationHeaders = req.headers.authorization;
      const authorization = authorizationCookies
        ? authorizationCookies
        : authorizationHeaders;

      // 인증 토큰이 없는 경우 다음 미들웨어로 진행합니다.
      if (!authorization) {
        return next(); // next() 호출 시 반환 값을 반환합니다.
      }

      // 인증 토큰이 존재할 경우 토큰 검사를 실시합니다.
      const [tokenType, tokenValue] = authorization.split(' ');
      if (tokenType !== 'Bearer') {
        res.clearCookie('authorization');
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '전달된 쿠키에서 오류가 발생하였습니다.' });
      }

      try {
        const { userId } = this.jwtService.verify(tokenValue, {
          secret: process.env.JWT_SECRET,
        });
        const user = await this.usersService.findUserByPk(userId);
        res.locals.user = user;
      } catch (error) {
        // 토큰 검증이 실패하는 경우, 사용자를 게스트로 처리합니다.
        console.log('토큰 검증 실패:', error);
      }

      next(); // next() 호출 시 반환 값을 반환합니다.
    } catch (e) {
      console.error(e);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '잘못된 방법입니다. (login.middleware' });
    }
  }
}
