import { Injectable } from '@nestjs/common';
import { TopicRepository } from 'src/topic/topic.repository';
import { TopicDto } from './dto/topic.dto';
import { EditTopicDto } from './dto/editTopic.dto';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<any> {
    try {
      const addTopic = await this.topicRepository.addTopic(topicDto, userId);
      return addTopic;
    } catch (e) {
      console.error(e);
      throw new Error('TopicService/addTopic');
    }
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<any> {
    try {
      const topic = await this.topicRepository.findTopicById(userId);
      return topic;
    } catch (e) {
      console.error(e);
      throw new Error('TopicService/findTopicById');
    }
  }

  /* 관심사 수정 */
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<any> {
    try {
      const editTopic = await this.topicRepository.editTopic(
        editTopicDto,
        userId,
      );
      return editTopic;
    } catch (e) {
      console.error(e);
      throw new Error('TopicService/editTopic');
    }
  }
}
