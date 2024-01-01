import { Module, forwardRef } from '@nestjs/common';
import { TopicService } from '@src/topic/topic.service';
import { TopicRepository } from '@src/topic/topic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '@src/topic/entities/topic.entity';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
    // 순환 의존성
    forwardRef(() => UsersModule),
  ],
  providers: [TopicService, TopicRepository],
  exports: [TopicService, TopicRepository],
})
export class TopicModule {}
