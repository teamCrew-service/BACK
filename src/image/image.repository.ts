import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { SaveImageDto } from './dto/saveImage.dto';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {}

  /* 나의 image 조회 */
  async findMyImages(crewId: number, userId: number): Promise<any> {
    try {
      const exImages = await this.imageRepository
        .createQueryBuilder('image')
        .select(['imageId', 'image'])
        .where('image.crewId = :crewId', { crewId })
        .andWhere('image.userId = :userId', { userId })
        .getRawMany();
      return exImages;
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/findMyImages');
    }
  }

  /* image 조회 */
  async findCrewImages(crewId: number): Promise<any> {
    try {
      const image = await this.imageRepository
        .createQueryBuilder('image')
        .select([
          'image.imageId AS imageId',
          'image.crewId AS crewId',
          'image.userId AS userId',
          'image.image AS image',
        ])
        .where('image.crewId = :crewId', { crewId })
        .andWhere('image.deletedAt IS NULL')
        .orderBy('image.createdAt', 'DESC')
        .getRawMany();

      return image;
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/findCrewImages');
    }
  }

  /* image 추가 */
  async saveImage(
    saveImageDto: SaveImageDto,
    crewId: number,
    userId: number,
  ): Promise<any> {
    try {
      const image = new Image();
      image.userId = userId;
      image.crewId = crewId;
      image.image = saveImageDto.image;
      const newImage = await this.imageRepository.save(image);
      return newImage;
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/saveImage');
    }
  }

  /* image 삭제 */
  async deleteImage(imageId: number): Promise<any> {
    try {
      const deleteImage = await this.imageRepository.update(
        { imageId },
        { deletedAt: new Date() },
      );
      return deleteImage;
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/deleteImage');
    }
  }
}
