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
    const exImages = await this.imageRepository
      .createQueryBuilder('image')
      .select(['imageId', 'image'])
      .where('image.crewId = :crewId', { crewId })
      .andWhere('image.userId = :userId', { userId })
      .getRawMany();
    return exImages;
  }

  /* image 조회 */
  async findCrewImages(crewId: number): Promise<any> {
    const image = await this.imageRepository
      .createQueryBuilder('image')
      .select(['imageId', 'crewId', 'userId', 'image'])
      .where('image.crewId = :crewId', { crewId })
      .getRawMany();

    return image;
  }

  /* image 추가 */
  async saveImage(
    saveImageDto: SaveImageDto,
    crewId: number,
    userId: number,
  ): Promise<any> {
    const image = new Image();
    image.userId = userId;
    image.crewId = crewId;
    image.image = saveImageDto.image;
    const newImage = await this.imageRepository.save(image);
    return newImage;
  }

  /* image 삭제 */
  async deleteImage(imageId: number): Promise<any> {
    const deleteImage = await this.imageRepository.update(
      { imageId },
      { deletedAt: new Date() },
    );
    return deleteImage;
  }
}
