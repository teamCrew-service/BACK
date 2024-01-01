import { Module, forwardRef } from '@nestjs/common';
import { LikeController } from '@src/like/like.controller';
import { LikeService } from '@src/like/like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '@src/like/entities/like.entity';
import { LikeRepository } from '@src/like/like.repository';
import { UsersModule } from '@src/users/users.module';
import { CrewModule } from '@src/crew/crew.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    // 순환 의존성
    forwardRef(() => UsersModule),
    forwardRef(() => CrewModule),
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
  exports: [LikeService, LikeRepository],
})
export class LikeModule {}
