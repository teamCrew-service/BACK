import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@Controller('home')
@ApiTags('Home API')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  /* 관심사 별 모임 찾기 */
  @Get(':category')
  @ApiOperation({
    summary: '관심사 별 모임 찾기 API',
    description: '관심사 별 모임 불러오기',
  })
  @ApiResponse({
    status: 200,
    description: '관심사 별 모임 불러오기',
    schema: {
      example: {
        userId: 1,
        crewType: '번개',
        category: '운동',
        crewAddress: '홍대입구역 1번 출구',
        crewMemberInfo: '털털한 분',
        crewTimeInfo: '2시간',
        crewAgeInfo: '20대 초반 ~ 30대 후반',
        permission: false,
        crewTitle: '오늘은 꼭 뛰어야 한다!!',
        crewContent: '오늘 꼭 뛰고 싶은 사람들 모이세요',
        crewMaxMember: 8,
      },
    },
  })
  async findByCategory(
    @Param('category') category: string,
    @Res() res: any,
  ): Promise<any> {
    const crewList = await this.homeService.findByCategory(category);
    return res.status(HttpStatus.OK).json(crewList);
  }
}
