import {
  Controller,
  Get,
  Res,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@Controller('home')
@ApiTags('Home API')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // 내 주변 모임 찾기
  @Get()
  @ApiOperation({
    summary: '내 주변 모임 찾기 API',
    description: '내 주변 모임을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 주변 모임을 조회합니다.',
    schema: {
      example: {
        crewId: 1,
        category: '친목',
        crewTitle: '같이 운동하고 건강한 저녁 함께해요',
        thumbnail: ['url1', 'url2', 'url3'],
        crewDDay: '2023-08-19T03:44:19.661Z',
        crewAddress: '소공동',
      },
    },
  })
  async getCrew(@Res() res: any): Promise<any> {
    try {
      // 내 주변 모임 조회
      const crew = await this.homeService.getCrew();

      // 내 주변 모임 조회 결과가 없을 경우
      if (crew.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          errormessage: '내 주변 모임 조회 결과가 없습니다.',
        });
      }
      // 내 주변 모임 조회 결과가 있을 경우
      return res.status(HttpStatus.OK).json(crew);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `리스트 조회 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 내 주변 모임 찾기(카테고리별)
  @Get(':category')
  @ApiOperation({
    summary: '내 주변 모임 찾기(카테고리별) API',
    description: '내 주변 모임을 카테고리별로 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 주변 모임을 카테고리별로 조회합니다.',
    schema: {
      example: {
        crewId: 1,
        category: '친목',
        crewTitle: '같이 운동하고 건강한 저녁 함께해요',
        thumbnail: ['url1', 'url2', 'url3'],
        crewDDay: '2023-08-19T03:44:19.661Z',
        crewAddress: '소공동',
      },
    },
  })
  async findByCategory(
    @Param('category') category: string,
    @Res() res: any,
  ): Promise<any> {
    try {
      // 카테고리별로 조회
      const crew = await this.homeService.findByCategory(category);

      // 카테고리별로 조회한 결과가 없을 경우
      if (crew.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          errormessage: '카테고리별로 조회한 결과가 없습니다.',
        });
      }
      // 카테고리별로 조회한 결과가 있을 경우
      return res.status(HttpStatus.OK).json(crew);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `리스트 조회 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
