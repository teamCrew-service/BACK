import { Body, Controller, Post } from '@nestjs/common';
import { CrewService } from './crew.service';
import { CreateCrewDto } from './dto/createCrew.dto';

@Controller('crew')
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @Post('createcrew')
  async createCrew(@Body() CreateCrewDto: CreateCrewDto) {
    return this.crewService.createCrew(CreateCrewDto);

@Controller()
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  /* 모임 글 상세 조회(참여 전)*/
  @Get('crew/:crewId')
  async findCrewDetail(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const crew = await this.crewService.findCrewDetail(crewId);
    return res.status(HttpStatus.OK).json(crew);
  }
}
