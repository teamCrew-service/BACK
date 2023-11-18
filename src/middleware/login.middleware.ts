import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LoginMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationCookies = req.cookies.authorization;
      const authorizationHeaders = req.headers.authorization;
      const authorization = authorizationCookies
        ? 'Bearer ' + authorizationCookies
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
          secret: process.env.JWT_ACCESS_SECRET,
        });
        const user = await this.usersService.findUserByPk(userId);
        res.locals.user = user;
      } catch (accessTokenError) {
        if (accessTokenError.name === 'TokenExpiredError') {
          // accessToken이 만료되면 cookie에서 제거
          res.clearCookie('authorization');
          // refreshToken 검사 시작
          const refreshToken = req.cookies.refreshToken;
          const user = await this.usersService.checkRefreshToken(refreshToken);
          if (!user) {
            res.clearCookie('refreshToken');
            return res.status(HttpStatus.NOT_FOUND).json({
              message: '유저 정보를 찾을 수 없습니다. 재로그인이 필요합니다.',
            });
          }
          try {
            const { userId } = await this.jwtService.verify(refreshToken, {
              secret: process.env.JWT_REFRESH_SECRET,
            });
            if (userId) {
              const accessToken = await this.authService.getAccessToken(userId);
              res.cookie('authorization', accessToken);
              res.locals.user = user;
            }
          } catch (refreshTokenError) {
            if (refreshTokenError.name === 'TokenExpiredError') {
              res.clearCookie('refreshToken');
              // db에 저장된 refreshToken 제거
              await this.usersService.deleteRefreshToken(refreshToken);
              return res
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: '재로그인이 필요합니다.' });
            }
          }
        } else {
          throw accessTokenError; // 다른 종류의 오류는 재전파
        }
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
