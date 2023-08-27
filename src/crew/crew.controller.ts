import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { CrewService } from './crew.service';

@Controller()
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  /* 모임 글 상세 조회(참여 전)*/
  @Get('api/crew/:crewId')
  async findCrewDetail(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const crew = await this.crewService.findCrewDetail(crewId);
    return res.status(HttpStatus.OK).json(crew);
  }
}
