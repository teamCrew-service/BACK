import { Injectable } from '@nestjs/common';
import { TopicRepository } from '@src/topic/topic.repository';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { Topic } from '@src/topic/entities/topic.entity';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class TopicService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly topicRepository: TopicRepository,
  ) {}

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicRepository.addTopic(topicDto, userId);
    } catch (e) {
      this.errorHandlingService.handleException('TopicService/addTopic', e);
    }
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<Topic[]> {
    try {
      return await this.topicRepository.findTopicById(userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'TopicService/findTopicById',
        e,
      );
    }
  }

  /* 관심사 수정 */
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicRepository.editTopic(editTopicDto, userId);
    } catch (e) {
      this.errorHandlingService.handleException('TopicService/editTopic', e);
    }
  }
}
