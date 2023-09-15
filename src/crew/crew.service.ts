import { Injectable } from '@nestjs/common';
import { CrewRepository } from './crew.repository';
import { CreateCrewDto } from './dto/createCrew.dto';
import { EditCrewDto } from './dto/editCrew.dto';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class CrewService {
  constructor(private crewRepository: CrewRepository) {}

  /* 권한 검사를 위한 crew 조회 */
  async findCrewForAuth(crewId: number): Promise<any> {
    const crew = await this.crewRepository.findCrewForAuth(crewId);
    return crew;
  }

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    const crewList = await this.crewRepository.findByCategory(category);
    return crewList;
  }

  async createCrew(createCrewDto: CreateCrewDto, userId: number): Promise<any> {
    const crew = await this.crewRepository.createCrew(createCrewDto, userId);
    return crew;
  }

  /*thumbnail을 aws3에 업로드하고 그 url을 받아온다.*/
  async thumbnailUpload(createCrewDto: CreateCrewDto): Promise<any> {
    //console.log(createCrewDto.thumbnail);
    const url = createCrewDto.thumbnail;
    const localPath = join(
      __dirname,
      '..',
      '..',
      'test',
      createCrewDto.crewTitle + '_' + Date.now() + '.jpg',
    );
    await this.downloadAndSave(url, localPath);
    return localPath;
    //thumbnail은 url로 되어있다.
  }
  async downloadAndSave(url: string, localPath: string): Promise<void> {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = createWriteStream(localPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
  /* 모임 글 상세 조회(참여 전) */
  async findCrewDetail(crewId: number): Promise<any> {
    const crew = await this.crewRepository.findCrewDetail(crewId);

    return crew;
  }

  /* 참여한 모임 */
  async findCreatedCrew(userId: number): Promise<any> {
    const createdCrew = await this.crewRepository.findCreatedCrew(userId);
    return createdCrew;
  }

  /* 모임 글 수정 */
  async editCrew(crewId: number, editCrewDto: EditCrewDto): Promise<any> {
    const crew = await this.crewRepository.editCrew(crewId, editCrewDto);
    return crew;
  }

  /* 모임 글 삭제 */
  async deleteCrew(crewId: number): Promise<any> {
    const crew = await this.crewRepository.deleteCrew(crewId);
    return crew;
  }

  /* crewId를 이용해 조회하기 */
  async findByCrewId(crewId: number): Promise<any> {
    const crew = await this.crewRepository.findByCrewId(crewId);
    return crew;
  }
}
