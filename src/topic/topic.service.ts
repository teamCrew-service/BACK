import { Injectable } from '@nestjs/common';
import { TopicRepository } from 'src/topic/topic.repository';
import { TopicDto } from './dto/topic.dto';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<any> {
    const addTopic = await this.topicRepository.addTopic(topicDto, userId);
    return addTopic;
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<any> {
    const topic = await this.topicRepository.findTopicById(userId);
    return topic;
  }

  /* 관심사 수정 */
  async editTopic(topicDto: TopicDto, userId: number): Promise<any> {
    const editTopic = await this.topicRepository.editTopic(topicDto, userId);
    return editTopic;
  }
}
