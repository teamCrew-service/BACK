import { Injectable } from '@nestjs/common';
import { TopicRepository } from '@src/topic/topic.repository';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { Topic } from '@src/topic/entities/topic.entity';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicRepository.addTopic(topicDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('TopicService/addTopic');
    }
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<Topic[]> {
    try {
      return await this.topicRepository.findTopicById(userId);
    } catch (e) {
      console.error(e);
      throw new Error('TopicService/findTopicById');
    }
  }

  /* 관심사 수정 */
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicRepository.editTopic(editTopicDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('TopicService/editTopic');
    }
  }
}
