import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleWare implements NestMiddleware<Request, Response> {
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
        ? `Bearer ` + authorizationCookies
        : authorizationHeaders;
      // Cookie가 존재하지 않을 경우
      if (!authorization) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '로그인이 필요한 기능입니다.' });
      }

      // Cookie가 존재할 경우
      const [tokenType, tokenValue] = authorization.split(' ');
      if (tokenType !== 'Bearer') {
        res.clearCookie('authorization');
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '잘못된 쿠키 형식입니다.' });
      }

      try {
        const { userId } = await this.jwtService.verify(tokenValue, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
        const user = await this.usersService.findUserByPk(userId);

        if (user) {
          res.locals.user = user;
          next();
        } else {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: '회원 정보가 없습니다.' });
        }
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
              next();
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
    } catch (e) {
      res.clearCookie('authorization');
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '잘못된 인증 방법입니다.(auth.middleware)' });
    }
  }
}
