import { Injectable } from '@nestjs/common';
import { ImageRepository } from '@src/image/image.repository';
import { SaveImageDto } from '@src/image/dto/saveImage.dto';
import * as AWS from 'aws-sdk';
import axios from 'axios';
import { Image } from '@src/image/entities/image.entity';
import { UpdateResult } from 'typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class ImageService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private imageRepository: ImageRepository,
  ) {}

  /* 나의 image 조회 */
  async findMyImages(crewId: number, userId: number): Promise<Image[]> {
    try {
      return await this.imageRepository.findMyImages(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException('ImageService/findMyImages', e);
    }
  }

  /* image 조회 */
  async findCrewImages(crewId: number): Promise<Image[]> {
    try {
      return await this.imageRepository.findCrewImages(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'ImageService/findCrewImages',
        e,
      );
    }
  }

  /* image 저장 */
  async saveImage(
    saveImageDto: SaveImageDto,
    crewId: number,
    userId: number,
  ): Promise<Image> {
    try {
      return await this.imageRepository.saveImage(saveImageDto, crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException('ImageService/saveImage', e);
    }
  }

  /* image 삭제 */
  async deleteImage(imageId: number): Promise<UpdateResult> {
    try {
      return await this.imageRepository.deleteImage(imageId);
    } catch (e) {
      this.errorHandlingService.handleException('ImageService/deleteImage', e);
    }
  }

  /* url 이미지를 변경하여 s3에 저장 */
  async urlToS3(url: string, key: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const mimeType = response.headers['content-type'];
      const bucket = process.env.AWS_BUCKET_NAME || 'YOUR_BUCKET_NAME'; // 환경 변수 또는 직접 값을 입력
      //key(filename) = 'YOUR_S3_OBJECT_KEY_HERE'; // 예: 'images/2020/08/01/abcdef.jpg'

      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY || 'YOUR_ACCESS_KEY',
        secretAccessKey: process.env.AWS_SECRET_KEY || 'YOUR_SECRET_KEY',
        region: process.env.AWS_REGION || 'YOUR_REGION', // 예: 'us-west-1'
      });

      const s3 = new AWS.S3();

      const s3Params = {
        Bucket: bucket,
        Key: key,
        Body: response.data,
        ContentType: mimeType,
        //ACL: 'public-read',
      };

      return new Promise((resolve, reject) => {
        s3.upload(s3Params, (err, data) => {
          if (err) reject(err);
          else resolve(data.Location);
        });
      });
    } catch (e) {
      this.errorHandlingService.handleException('ImageService/urlToS3', e);
    }
  }

  /* crew 삭제로 인한 image 삭제 */
  async deleteImageByCrew(crewId: number): Promise<UpdateResult> {
    try {
      return await this.imageRepository.deleteImageByCrew(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'ImageService/deleteImageByCrew',
        e,
      );
    }
  }

  /* 탈퇴 시 user에 해당하는 부분 image 삭제 */
  async deleteImageExitCrew(
    crewId: number,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      return await this.imageRepository.deleteImageExitCrew(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'ImageService/deleteImageExitCrew',
        e,
      );
    }
  }
}
