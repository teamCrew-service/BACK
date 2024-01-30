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
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class CrewService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private crewRepository: CrewRepository,
  ) {}

  /* 권한 검사를 위한 crew 조회 */
  async findCrewForAuth(crewId: number): Promise<Crew> {
    try {
      return await this.crewRepository.findCrewForAuth(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'CrewService/findCrewForAuth',
        e,
      );
    }
  }

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<Crew[]> {
    try {
      return await this.crewRepository.findByCategory(category);
    } catch (e) {
      this.errorHandlingService.handleException(
        'CrewService/findByCategory',
        e,
      );
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
      this.errorHandlingService.handleException('CrewService/createCrew', e);
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
      this.errorHandlingService.handleException(
        'CrewService/thumbnailUpload',
        e,
      );
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
      this.errorHandlingService.handleException(
        'CrewService/downloadAndSave',
        e,
      );
    }
  }

  /* 모임 글 상세 조회(참여 전) */
  async findCrewDetail(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findCrewDetail(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'CrewService/findCrewDetail',
        e,
      );
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
      this.errorHandlingService.handleException('CrewService/editCrew', e);
    }
  }

  /* 모임 글 삭제 */
  async deleteCrew(crewId: number): Promise<UpdateResult> {
    try {
      return await this.crewRepository.deleteCrew(crewId);
    } catch (e) {
      this.errorHandlingService.handleException('CrewService/deleteCrew', e);
    }
  }

  /* crewId를 이용해 조회하기 */
  async findByCrewId(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findByCrewId(crewId);
    } catch (e) {
      this.errorHandlingService.handleException('CrewService/findByCrewId', e);
    }
  }

  /* 대기중인 모임을 위한 조회 */
  async findWaitingPermission(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findWaitingPermission(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'CrewService/findWaitingPermission',
        e,
      );
    }
  }

  /* userId를 이용해 내가 생성한 모임 조회하기 */
  async findMyCrew(userId: number): Promise<Crew[]> {
    try {
      return await this.crewRepository.findMyCrew(userId);
    } catch (e) {
      this.errorHandlingService.handleException('CrewService/findMyCrew', e);
    }
  }

  /* crewId로 Detail하게 조회하기 */
  async findCrewDetailByCrewId(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository.findCrewDetailByCrewId(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'CrewService/findCrewDetailByCrewId',
        e,
      );
    }
  }

  /* myCrew를 하나만 조회하기 */
  async findOneCrew(crewId: number, userId: number): Promise<Crew> {
    try {
      return await this.crewRepository.findOneCrew(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException('CrewService/findOneCrew', e);
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
      this.errorHandlingService.handleException('CrewService/delegateCrew', e);
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
      this.errorHandlingService.handleException('CrewService/editThumbnail', e);
    }
  }
}
