import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { VoteFormRepository } from '@src/voteform/voteform.repository';
import { CreateVoteFormDto } from '@src/voteform/dto/createVoteForm.dto';
import { EditVoteFormDto } from '@src/voteform/dto/editVoteForm.dto';
import { Cron } from '@nestjs/schedule';
import { VoteForm } from './entities/voteform.entity';
import { UpdateResult } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class VoteFormService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly voteFormRespository: VoteFormRepository,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  @Cron('0 0 * * * *')
  async voteFormCron() {
    try {
      await this.voteFormRespository.updateVoteIsDone();
    } catch (e) {
      this.handleException('VoteFormService/voteFormCron', e);
    }
  }

  /* 투표 공지 등록 */
  async createVoteForm(
    userId: number,
    crewId: number,
    createVoteFormDto: CreateVoteFormDto,
  ): Promise<VoteForm> {
    try {
      return await this.voteFormRespository.createVoteForm(
        userId,
        crewId,
        createVoteFormDto,
      );
    } catch (e) {
      this.handleException('VoteFormService/createVoteForm', e);
    }
  }

  /* 투표 공지 전체 목록 조회 */
  async findAllVoteForm(
    crewId: number,
    userId: number,
  ): Promise<Array<Object>> {
    try {
      return await this.voteFormRespository.findAllVoteForm(crewId, userId);
    } catch (e) {
      this.handleException('VoteFormService/findAllVoteForm', e);
    }
  }

  /* 투표 공지 상세 조회 */
  async findVoteFormDetail(
    crewId: number,
    voteFormId: number,
  ): Promise<VoteForm> {
    try {
      return await this.voteFormRespository.findVoteFormDetail(
        crewId,
        voteFormId,
      );
    } catch (e) {
      this.handleException('VoteFormService/findVoteFormDetail', e);
    }
  }

  /* 투표 공지가 익명 투표인지 확인 */
  async findVoteFormForAnonymous(
    crewId: number,
    voteFormId: number,
  ): Promise<Object> {
    try {
      return await this.voteFormRespository.findVoteFormForAnonymous(
        crewId,
        voteFormId,
      );
    } catch (e) {
      this.handleException('VoteFormService/findVoteFormForAnonymous', e);
    }
  }

  /* 투표 공지 수정 */
  async editVoteForm(
    crewId: number,
    voteFormId: number,
    editVoteFormDto: EditVoteFormDto,
  ): Promise<UpdateResult> {
    try {
      return await this.voteFormRespository.editVoteForm(
        crewId,
        voteFormId,
        editVoteFormDto,
      );
    } catch (e) {
      this.handleException('VoteFormService/editVoteForm', e);
    }
  }

  /* 투표 공지 삭제 */
  async deleteVoteForm(
    crewId: number,
    voteFormId: number,
  ): Promise<UpdateResult> {
    try {
      return await this.voteFormRespository.deleteVoteForm(crewId, voteFormId);
    } catch (e) {
      this.handleException('VoteFormService/deleteVoteForm', e);
    }
  }

  /* 위임에 따라 투표 위임하기 */
  async delegateVoteForm(delegator: number, crewId: number): Promise<string> {
    try {
      await this.voteFormRespository.delegateVoteForm(delegator, crewId);
      return '투표 공지 위임 완료';
    } catch (e) {
      this.handleException('VoteFormService/delegateVoteForm', e);
    }
  }

  /* crew 삭제에 따른 voteForm 삭제 */
  async deleteVoteFormByCrew(crewId: number): Promise<UpdateResult> {
    try {
      return await this.voteFormRespository.deleteVoteFormByCrew(crewId);
    } catch (e) {
      this.handleException('VoteFormService/deleteVoteFormByCrew', e);
    }
  }
}
