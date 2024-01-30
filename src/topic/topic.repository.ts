import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from '@src/topic/entities/topic.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class TopicRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
  ) {}

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<Object> {
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
    } catch (e) {
      this.errorHandlingService.handleException('TopicRepository/addTopic', e);
    }
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<Topic[]> {
    try {
      return await this.topicRepository
        .createQueryBuilder('topic')
        .select(['userId', 'interestTopic'])
        .where('topic.userId = :userId', { userId })
        .getRawMany();
    } catch (e) {
      this.errorHandlingService.handleException(
        'TopicRepository/findTopicById',
        e,
      );
    }
  }

  /* 관심사 수정*/
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<Object> {
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
      this.errorHandlingService.handleException('TopicRepository/editTopic', e);
    }
  }

  /* 탈퇴에 따라 topic 삭제 처리 */
  async deleteTopic(userId: number): Promise<DeleteResult> {
    try {
      return await this.topicRepository
        .createQueryBuilder('topic')
        .delete()
        .from(Topic)
        .where('topic.userId = :userId', { userId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'TopicRepository/deleteTopic',
        e,
      );
    }
  }
}
