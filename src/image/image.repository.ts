import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '@src/image/entities/image.entity';
import { Repository, UpdateResult } from 'typeorm';
import { SaveImageDto } from '@src/image/dto/saveImage.dto';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {}

  /* 나의 image 조회 */
  async findMyImages(crewId: number, userId: number): Promise<Image[]> {
    try {
      return await this.imageRepository
        .createQueryBuilder('image')
        .select(['imageId', 'image', 'userId'])
        .where('image.crewId = :crewId', { crewId })
        .andWhere('image.userId = :userId', { userId })
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/findMyImages');
    }
  }

  /* image 조회 */
  async findCrewImages(crewId: number): Promise<Image[]> {
    try {
      return await this.imageRepository
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
  ): Promise<Image> {
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
  async deleteImage(imageId: number): Promise<UpdateResult> {
    try {
      return await this.imageRepository.update(
        { imageId },
        { deletedAt: new Date() },
      );
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/deleteImage');
    }
  }

  /* crew 삭제로 인한 image 삭제 */
  async deleteImageByCrew(crewId: number): Promise<UpdateResult> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      return await this.imageRepository
        .createQueryBuilder('image')
        .update(Image)
        .set({ deletedAt: today })
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/deleteImageByCrew');
    }
  }

  /* 탈퇴 시 user에 해당하는 부분 image 삭제 */
  async deleteImageExitCrew(
    crewId: number,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      return await this.imageRepository
        .createQueryBuilder('image')
        .update(Image)
        .set({ deletedAt: today })
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('ImageRepository/deleteImageExitCrew');
    }
  }
}
