import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from '@src/topic/entities/topic.entity';
import { Repository } from 'typeorm';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';

@Injectable()
export class TopicRepository {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
  ) {}

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<any> {
    try {
      const interestTopic = topicDto.interestTopic;

      if (interestTopic.includes(',')) {
        const topics = interestTopic.split(',');
        for (const interestTopic of topics) {
          const topic = new Topic();
          topic.userId = userId;
          if (interestTopic.includes('%2F') === true) {
            const item = interestTopic.replace('%2F', '/');
            topic.interestTopic = item;
          } else {
            topic.interestTopic = interestTopic;
          }
          await this.topicRepository.save(topic);
        }
      } else {
        const topic = new Topic();
        topic.userId = userId;
        if (interestTopic.includes('%2F') === true) {
          const item = interestTopic.replace('%2F', '/');
          topic.interestTopic = item;
        } else {
          topic.interestTopic = interestTopic;
        }
        await this.topicRepository.save(topic);
      }

      return { message: '주제가 성공적으로 저장되었습니다.' };
    } catch (error) {
      console.error('주제 저장 실패:', error);
      throw new Error('TopicRepository/addTopic');
    }
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<any> {
    try {
      const topic = await this.topicRepository
        .createQueryBuilder('topic')
        .select(['userId', 'interestTopic'])
        .where('topic.userId = :userId', { userId })
        .getRawMany();
      return topic;
    } catch (e) {
      console.error(e);
      throw new Error('TopicRepository/findTopicById');
    }
  }

  /* 관심사 수정*/
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<any> {
    try {
      const interestTopic = editTopicDto.interestTopic;

      // 기존의 topic 삭제
      await this.topicRepository
        .createQueryBuilder()
        .delete()
        .from(Topic)
        .where('topic.userId = :userId', { userId })
        .execute();

      // 새로운 topic 넣어주기
      if (interestTopic.includes(',')) {
        const newTopics = interestTopic.split(',');

        for (const newTopic of newTopics) {
          const topic = new Topic();
          topic.userId = userId;
          topic.interestTopic = newTopic;
          await this.topicRepository.save(topic);
        }
      } else {
        const topic = new Topic();
        topic.userId = userId;
        topic.interestTopic = interestTopic;
        await this.topicRepository.save(topic);
      }

      return { message: '관심사 주제 수정 성공' };
    } catch (e) {
      console.error(e);
      throw new Error('TopicRepository/editTopic');
    }
  }

  /* 탈퇴에 따라 topic 삭제 처리 */
  async deleteTopic(userId: number): Promise<any> {
    try {
      const deleteTopic = await this.topicRepository
        .createQueryBuilder('topic')
        .delete()
        .from(Topic)
        .where('topic.userId = :userId', { userId })
        .execute();
      return deleteTopic;
    } catch (e) {
      console.error(e);
      throw new Error('TopicRepository/deleteTopic');
    }
  }
}
