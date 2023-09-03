import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { Repository } from 'typeorm';
import { TopicDto } from './dto/topic-user.dto';

@Injectable()
export class TopicRepository {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
  ) {}

  async addTopic(@Body() topicDto: TopicDto): Promise<any> {
    try {
      const userId = topicDto.userId;
      const interestTopic = topicDto.interestTopic;

      if (interestTopic.includes(',')) {
        const topics = interestTopic.split(',');
        for (const interestTopic of topics) {
          const topic = new Topic();
          topic.userId = userId;
          topic.interestTopic = interestTopic;
          await this.topicRepository.save(topic); // TypeORM과 같은 데이터베이스 ORM을 사용하고 있다고 가정합니다.
        }
      } else {
        const topic = new Topic();
        topic.userId = userId;
        topic.interestTopic = interestTopic;
        await this.topicRepository.save(topic);
      }

      return { message: '주제가 성공적으로 저장되었습니다.' };
    } catch (error) {
      console.error('주제 저장 실패:', error);
      throw error; // 오류를 상위 수준에서 처리하기 위해 이 오류를 다시 던집니다. 호출자에서 적절히 처리할 수 있습니다.
    }
  }
}
