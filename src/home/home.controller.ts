import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  /* 관심사 별 모임 찾기 */
  @Get('home/:category')
  async findByCategory(
    @Param('category') category: string,
    @Res() res: any,
  ): Promise<any> {
    const crewList = await this.homeService.findByCategory(category);
    return res.status(HttpStatus.OK).json(crewList);
  }
}
