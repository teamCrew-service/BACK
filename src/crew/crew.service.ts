import { Injectable } from '@nestjs/common';
import { CrewRepository } from '@src/crew/crew.repository';
import { CreateCrewDto } from '@src/crew/dto/createCrew.dto';
import { EditCrewDto } from '@src/crew/dto/editCrew.dto';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Crew } from '@src/crew/entities/crew.entity';
import CrewDetail from '@src/crew/interface/crewDetail';
import { UpdateResult } from 'typeorm';

@Injectable()
export class CrewService {
  constructor(private crewRepository: CrewRepository) {}

  /* 권한 검사를 위한 crew 조회 */
  async findCrewForAuth(crewId: number): Promise<Crew> {
    try {
      return await this.crewRepository.findCrewForAuth(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findCrewForAuth');
    }
  }

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<Crew[]> {
    try {
      return await this.crewRepository.findByCategory(category);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findByCategory');
    }
  }

  /* 모임 생성 */
  async createCrew(
    createCrewDto: CreateCrewDto,
    userId: number,
  ): Promise<Crew> {
    try {
      return await this.crewRepository.createCrew(createCrewDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/createCrew');
    }
  }

  /*thumbnail을 aws3에 업로드하고 그 url을 받아온다.*/
  async thumbnailUpload(createCrewDto: CreateCrewDto): Promise<string> {
    try {
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
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/thumbnailUpload');
    }
  }
  async downloadAndSave(url: string, localPath: string): Promise<void> {
    try {
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
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/downloadAndSave');
    }
  }

  /* 모임 글 상세 조회(참여 전) */
  async findCrewDetail(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findCrewDetail(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findCrewDetail');
    }
  }

  /* 모임 글 수정 */
  async editCrew(
    crewId: number,
    editCrewDto: EditCrewDto,
  ): Promise<UpdateResult> {
    try {
      return await this.crewRepository.editCrew(crewId, editCrewDto);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/editCrew');
    }
  }

  /* 모임 글 삭제 */
  async deleteCrew(crewId: number): Promise<UpdateResult> {
    try {
      return await this.crewRepository.deleteCrew(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/deleteCrew');
    }
  }

  /* crewId를 이용해 조회하기 */
  async findByCrewId(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findByCrewId(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findByCrewId');
    }
  }

  /* 대기중인 모임을 위한 조회 */
  async findWaitingPermission(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findWaitingPermission(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findWaitingPermission');
    }
  }

  /* userId를 이용해 내가 생성한 모임 조회하기 */
  async findMyCrew(userId: number): Promise<Crew[]> {
    try {
      return await this.crewRepository.findMyCrew(userId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findMyCrew');
    }
  }

  /* crewId로 Detail하게 조회하기 */
  async findCrewDetailByCrewId(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findCrewDetailByCrewId(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findCrewDetailByCrewId');
    }
  }

  /* myCrew를 하나만 조회하기 */
  async findOneCrew(crewId: number, userId: number): Promise<Crew> {
    try {
      return await this.crewRepository.findOneCrew(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findOneCrew');
    }
  }

  /* 모임장 위임하기 */
  async delegateCrew(
    delegator: number,
    crewId: number,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      return await this.crewRepository.delegateCrew(delegator, crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/delegateCrew');
    }
  }

  /* Thumbnail 수정하기 */
  async editThumbnail(
    crewId: number,
    thumbnail: string,
  ): Promise<UpdateResult> {
    try {
      return await this.crewRepository.editThumbnail(crewId, thumbnail);
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/editThumbnail');
    }
  }
}
