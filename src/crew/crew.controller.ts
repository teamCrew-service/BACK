import {
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
  Controller,
  Post,
} from '@nestjs/common';
import { CrewService } from './crew.service';
import { CreateCrewDto } from './dto/createCrew.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@Controller('crew')
@ApiTags('Crew API')
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @Post('createcrew')
  @ApiOperation({
    summary: '모임 생성 API',
    description: '모임을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '모임 생성 성공',
  })
  async createCrew(
    @Body() CreateCrewDto: CreateCrewDto,
    @Res() res: any,
  ): Promise<any> {
    await this.crewService.createCrew(CreateCrewDto);
    return res.status(HttpStatus.CREATED).json({ message: '모임 생성 성공' });
  }
  /* 모임 글 상세 조회(참여 전)*/
  @Get(':crewId')
  @ApiOperation({
    summary: '모임 글 상세 조회(참여 전) API',
    description: '모임의 상세한 내용을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 상세한 내용을 조회합니다.',
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
  async findCrewDetail(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const crew = await this.crewService.findCrewDetail(crewId);
    return res.status(HttpStatus.OK).json(crew);
  }
}
