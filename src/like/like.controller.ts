import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LikeService } from '@src/like/like.service';

@Controller('like')
@ApiTags('Like API')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /* 찜하기 */
  @Post(':crewId')
  @ApiOperation({
    summary: '찜하기 API',
    description: '관심있는 모임을 나중에 확인하기 위한 API',
  })
  @ApiResponse({
    status: 200,
    description: '찜하기 성공',
  })
  @ApiBearerAuth('accessToken')
  async likeCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 좋아요 확인
      const like = await this.likeService.confirmLiked(crewId, userId);
      if (like) {
        return res
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ message: '이미 찜한 crew입니다.' });
      }
      // 없을 경우 좋아요 생성
      await this.likeService.likeCrew(crewId, userId);
      return res.status(HttpStatus.OK).json({ message: '찜하기 성공' });
    } catch (e) {
      console.error(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '찜하기 실패' });
    }
  }

  /* 찜 취소하기 */
  @Delete(':crewId')
  @ApiOperation({
    summary: '찜 취소하기 API',
    description: '찜한 모임을 취소하기 위한 API',
  })
  @ApiResponse({
    status: 200,
    description: '찜 취소하기 성공',
  })
  @ApiBearerAuth('accessToken')
  async cancelLikeCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 좋아요 확인
      const like = await this.likeService.confirmLiked(crewId, userId);
      if (like) {
        await this.likeService.cancelLikeCrew(crewId, userId);
        return res.status(HttpStatus.OK).json({ message: '찜 취소하기 성공' });
      }
      return res
        .status(HttpStatus.NOT_ACCEPTABLE)
        .json({ message: '찜한 crew가 아닙니다.' });
    } catch (e) {
      console.error(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '찜 취소하기 실패' });
    }
  }
}
