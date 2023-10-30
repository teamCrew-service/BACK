import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { SaveImageDto } from './dto/saveImage.dto';
import * as AWS from 'aws-sdk';
import axios from 'axios';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  /* 나의 image 조회 */
  async findMyImages(crewId: number, userId: number): Promise<any> {
    try {
      const exImages = await this.imageRepository.findMyImages(crewId, userId);
      return exImages;
    } catch (e) {
      console.error(e);
      throw new Error('ImageService/findMyImages');
    }
  }

  /* image 조회 */
  async findCrewImages(crewId: number): Promise<any> {
    try {
      const image = await this.imageRepository.findCrewImages(crewId);
      return image;
    } catch (e) {
      console.error(e);
      throw new Error('ImageService/findCrewImages');
    }
  }

  /* image 저장 */
  async saveImage(
    saveImageDto: SaveImageDto,
    crewId: number,
    userId: number,
  ): Promise<any> {
    try {
      const newImage = await this.imageRepository.saveImage(
        saveImageDto,
        crewId,
        userId,
      );
      return newImage;
    } catch (e) {
      console.error(e);
      throw new Error('ImageService/saveImage');
    }
  }

  /* image 삭제 */
  async deleteImage(imageId: number): Promise<any> {
    try {
      const deleteImage = await this.imageRepository.deleteImage(imageId);
      return deleteImage;
    } catch (e) {
      console.error(e);
      throw new Error('ImageService/deleteImage');
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
      console.error(e);
      throw new Error('ImageService/urlToS3');
    }
  }
}
