import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { SaveImageDto } from './dto/saveImage.dto';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  /* 나의 image 조회 */
  async findMyImages(crewId: number, userId: number): Promise<any> {
    const exImages = await this.imageRepository.findMyImages(crewId, userId);
    return exImages;
  }

  /* image 조회 */
  async findCrewImages(crewId: number): Promise<any> {
    const image = await this.imageRepository.findCrewImages(crewId);
    return image;
  }

  /* image 저장 */
  async saveImage(
    saveImageDto: SaveImageDto,
    crewId: number,
    userId: number,
  ): Promise<any> {
    const newImage = await this.imageRepository.saveImage(
      saveImageDto,
      crewId,
      userId,
    );
    return newImage;
  }

  /* image 삭제 */
  async deleteImage(imageId: number): Promise<any> {
    const deleteImage = await this.imageRepository.deleteImage(imageId);
    return deleteImage;
  }
}
