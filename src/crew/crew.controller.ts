import { Body, Controller, Post } from '@nestjs/common';
import { CrewService } from './crew.service';
import { CreateCrewDto } from './dto/createCrew.dto';

@Controller('crew')
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @Post('createcrew')
  async createCrew(@Body() CreateCrewDto: CreateCrewDto) {
    return this.crewService.createCrew(CreateCrewDto);
  }
}
