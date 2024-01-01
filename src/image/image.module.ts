import { Module, forwardRef } from '@nestjs/common';
import { ImageService } from '@src/image/image.service';
import { ImageRepository } from '@src/image/image.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '@src/image/entities/image.entity';
import { ImageController } from '@src/image/image.controller';
import { CrewModule } from '@src/crew/crew.module';
import { MemberModule } from '@src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    //순환 의존성
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
