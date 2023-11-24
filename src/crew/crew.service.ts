import { Injectable } from '@nestjs/common';
import { CrewRepository } from './crew.repository';
import { CreateCrewDto } from './dto/createCrew.dto';
import { EditCrewDto } from './dto/editCrew.dto';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as AWS from 'aws-sdk';
@Injectable()
export class CrewService {
  constructor(private crewRepository: CrewRepository) {}

  /* 권한 검사를 위한 crew 조회 */
  async findCrewForAuth(crewId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.findCrewForAuth(crewId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findCrewForAuth');
    }
  }

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    try {
      const crewList = await this.crewRepository.findByCategory(category);
      return crewList;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findByCategory');
    }
  }

  /* 모임 생성 */
  async createCrew(createCrewDto: CreateCrewDto, userId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.createCrew(createCrewDto, userId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/createCrew');
    }
  }

  /*thumbnail을 aws3에 업로드하고 그 url을 받아온다.*/
  async thumbnailUpload(createCrewDto: CreateCrewDto): Promise<any> {
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
  async findCrewDetail(crewId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.findCrewDetail(crewId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findCrewDetail');
    }
  }

  /* 모임 글 수정 */
  async editCrew(crewId: number, editCrewDto: EditCrewDto): Promise<any> {
    try {
      const crew = await this.crewRepository.editCrew(crewId, editCrewDto);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/editCrew');
    }
  }

  /* 모임 글 삭제 */
  async deleteCrew(crewId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.deleteCrew(crewId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/deleteCrew');
    }
  }

  /* crewId를 이용해 조회하기 */
  async findByCrewId(crewId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.findByCrewId(crewId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findByCrewId');
    }
  }

  /* 대기중인 모임을 위한 조회 */
  async findWaitingPermission(crewId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.findWaitingPermission(crewId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findWaitingPermission');
    }
  }

  /* userId를 이용해 내가 생성한 모임 조회하기 */
  async findMyCrew(userId: number): Promise<any> {
    try {
      const myCrew = await this.crewRepository.findMyCrew(userId);
      return myCrew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findMyCrew');
    }
  }

  /* crewId로 Detail하게 조회하기 */
  async findCrewDetailByCrewId(crewId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.findCrewDetailByCrewId(crewId);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/findCrewDetailByCrewId');
    }
  }

  /* myCrew를 하나만 조회하기 */
  async findOneCrew(crewId: number, userId: number): Promise<any> {
    try {
      const crew = await this.crewRepository.findOneCrew(crewId, userId);
      return crew;
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
  ): Promise<any> {
    try {
      const delegateCrew = await this.crewRepository.delegateCrew(
        delegator,
        crewId,
        userId,
      );
      return delegateCrew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/delegateCrew');
    }
  }

  /* Thumbnail 수정하기 */
  async editThumbnail(crewId: number, thumbnail: string): Promise<any> {
    try {
      const crew = await this.crewRepository.editThumbnail(crewId, thumbnail);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewService/editThumbnail');
    }
  }

  /* s3에 저장된 image 삭제 */
  async deleteS3Image(key: string): Promise<any> {
    const bucket = process.env.AWS_BUCKET_NAME || 'YOUR_BUCKET_NAME'; // 환경 변수 또는 직접 값을 입력
    //key(filename) = 'YOUR_S3_OBJECT_KEY_HERE'; // 예: 'images/2020/08/01/abcdef.jpg'

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY || 'YOUR_ACCESS_KEY',
      secretAccessKey: process.env.AWS_SECRET_KEY || 'YOUR_SECRET_KEY',
      region: process.env.AWS_REGION || 'YOUR_REGION', // 예: 'us-west-1'
    });

    const s3 = new AWS.S3();

    const deleteParams = {
      Bucket: bucket,
      Key: 'thumbnail/' + key,
    };

    const deleteResult = await s3.deleteObject(deleteParams).promise();
    return deleteResult;
  }
}
