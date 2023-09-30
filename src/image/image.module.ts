import { Module, forwardRef } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageController } from './image.controller';
import { CrewModule } from 'src/crew/crew.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    forwardRef(() => CrewModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
