import { Module, forwardRef } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikeRepository } from './like.repository';
import { UsersModule } from 'src/users/users.module';
import { CrewModule } from 'src/crew/crew.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    forwardRef(() => UsersModule),
    forwardRef(() => CrewModule),
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
  exports: [LikeService, LikeRepository],
})
export class LikeModule {}
