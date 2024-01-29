import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { TopicRepository } from '@src/topic/topic.repository';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { Topic } from '@src/topic/entities/topic.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TopicService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly topicRepository: TopicRepository,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  /* 관심사 선택 */
  async addTopic(topicDto: TopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicRepository.addTopic(topicDto, userId);
    } catch (e) {
      this.handleException('TopicService/addTopic', e);
    }
  }

  /* 관심사 조회 */
  async findTopicById(userId: number): Promise<Topic[]> {
    try {
      return await this.topicRepository.findTopicById(userId);
    } catch (e) {
      this.handleException('TopicService/findTopicById', e);
    }
  }

  /* 관심사 수정 */
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicRepository.editTopic(editTopicDto, userId);
    } catch (e) {
      this.handleException('TopicService/editTopic', e);
    }
  }
}
