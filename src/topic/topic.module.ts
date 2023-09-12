import { Module, forwardRef } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicRepository } from 'src/topic/topic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]), forwardRef(() => UsersModule)],
  providers: [TopicService, TopicRepository],
  exports: [TopicService, TopicRepository],
})
export class TopicModule {}
