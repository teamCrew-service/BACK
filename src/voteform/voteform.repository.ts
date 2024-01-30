import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { VoteForm } from '@src/voteform/entities/voteform.entity';
import { CreateVoteFormDto } from '@src/voteform/dto/createVoteForm.dto';
import { EditVoteFormDto } from '@src/voteform/dto/editVoteForm.dto';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class VoteFormRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(VoteForm)
    private voteFormRepository: Repository<VoteForm>,
  ) {}

  /* 투표 공지 등록 */
  async createVoteForm(
    userId: number,
    crewId: number,
    createVoteFormDto: CreateVoteFormDto,
  ): Promise<VoteForm> {
    try {
      const voteForm = new VoteForm();
      voteForm.userId = userId;
      voteForm.crewId = crewId;
      voteForm.voteFormTitle = createVoteFormDto.voteFormTitle;
      voteForm.voteFormContent = createVoteFormDto.voteFormContent;
      voteForm.multipleVotes = createVoteFormDto.multipleVotes;
      voteForm.anonymousVote = createVoteFormDto.anonymousVote;
      voteForm.voteFormEndDate = createVoteFormDto.voteFormEndDate;
      voteForm.voteFormOption1 = createVoteFormDto.voteFormOption1;
      voteForm.voteFormOption2 = createVoteFormDto.voteFormOption2;
      voteForm.voteFormOption3 = createVoteFormDto.voteFormOption3;
      voteForm.voteFormOption4 = createVoteFormDto.voteFormOption4;
      voteForm.voteFormOption5 = createVoteFormDto.voteFormOption5;
      await this.voteFormRepository.save(voteForm);
      return voteForm;
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/createVoteForm',
        e,
      );
    }
  }

  /* 투표 공지 전체 목록 조회 */
  async findAllVoteForm(crewId: number, userId: number): Promise<Object[]> {
    try {
      const voteForm = await this.voteFormRepository
        .createQueryBuilder('voteform')
        .leftJoin('vote', 'vote', 'vote.voteFormId = voteform.voteFormId')
        .select([
          'voteform.voteFormId AS voteFormId',
          'voteform.crewId AS crewId',
          'voteform.voteFormTitle AS voteFormTitle',
          'voteform.voteFormContent AS voteFormContent',
          'voteform.voteFormEndDate AS voteFormEndDate',
          'voteform.voteFormIsDone AS voteFormIsDone',
          `CASE WHEN EXISTS (SELECT 1 FROM vote WHERE vote.voteFormId = voteform.voteFormId AND vote.userId = ${userId}) THEN true ELSE false END AS alreadyVote`,
        ])
        .where('voteform.crewId = :crewId', { crewId })
        .andWhere('voteform.deletedAt IS NULL')
        .orderBy('voteform.voteFormEndDate', 'ASC')
        .groupBy('voteform.voteFormId')
        .getRawMany();
      return voteForm;
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/findAllVoteForm',
        e,
      );
    }
  }

  /* 투표 공지 상세 조회 */
  async findVoteFormDetail(
    crewId: number,
    voteFormId: number,
  ): Promise<VoteForm> {
    try {
      const voteForm = await this.voteFormRepository
        .createQueryBuilder('voteform')
        .where('voteform.crewId = :crewId', { crewId })
        .andWhere('voteform.voteFormId = :voteFormId', { voteFormId })
        .select([
          'voteFormId',
          'voteFormTitle',
          'voteFormContent',
          'multipleVotes',
          'anonymousVote',
          'voteFormEndDate',
          'voteFormOption1',
          'voteFormOption2',
          'voteFormOption3',
          'voteFormOption4',
          'voteFormOption5',
        ])
        .getRawOne();
      return voteForm;
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/findVoteFormDetail',
        e,
      );
    }
  }

  /* 투표 공지가 익명 투표인지 확인 */
  async findVoteFormForAnonymous(
    crewId: number,
    voteFormId: number,
  ): Promise<Object> {
    try {
      const voteForm = await this.voteFormRepository
        .createQueryBuilder('voteform')
        .select(['voteFormId', 'anonymousVote'])
        .where('voteform.crewId = :crewId', { crewId })
        .andWhere('voteform.voteFormId = :voteFormId', { voteFormId })
        .getRawOne();
      return voteForm;
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/findVoteFormForAnonymous',
        e,
      );
    }
  }

  /* 투표 공지 수정 */
  async editVoteForm(
    crewId: number,
    voteFormId: number,
    editVoteFormDto: EditVoteFormDto,
  ): Promise<UpdateResult> {
    try {
      const {
        voteFormTitle,
        voteFormContent,
        voteFormEndDate,
        multipleVotes,
        anonymousVote,
        voteFormOption1,
        voteFormOption2,
        voteFormOption3,
        voteFormOption4,
        voteFormOption5,
      } = editVoteFormDto;

      return await this.voteFormRepository.update(
        { crewId, voteFormId },
        {
          voteFormTitle,
          voteFormContent,
          voteFormEndDate,
          multipleVotes,
          anonymousVote,
          voteFormOption1,
          voteFormOption2,
          voteFormOption3,
          voteFormOption4,
          voteFormOption5,
        },
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/editVoteForm',
        e,
      );
    }
  }

  /* 투표 공지 삭제 */
  async deleteVoteForm(
    crewId: number,
    voteFormId: number,
  ): Promise<UpdateResult> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      return await this.voteFormRepository
        .createQueryBuilder('voteform')
        .update(VoteForm)
        .set({ deletedAt: today })
        .where('crewId = :crewId', { crewId })
        .andWhere('voteFormId = :voteFormId', { voteFormId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/deleteVoteForm',
        e,
      );
    }
  }

  /* 오늘 날짜 기준보다 날짜가 지난 투표를 찾아 IsDone을 true로 전환 */
  async updateVoteIsDone(): Promise<void> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      await this.voteFormRepository
        .createQueryBuilder('voteform')
        .update(VoteForm)
        .set({ voteFormIsDone: true })
        .where('voteFormEndDate < :today', { today })
        .andWhere('voteFormIsDone = :voteFormIsDone', {
          voteFormIsDone: false,
        })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/updateVoteIsDone',
        e,
      );
    }
  }

  /* 위임에 따라 투표 위임하기 */
  async delegateVoteForm(delegator: number, crewId: number): Promise<void> {
    try {
      await this.voteFormRepository
        .createQueryBuilder('voteform')
        .update(VoteForm)
        .set({ userId: delegator })
        .where('crewId = :crewId', { crewId })
        .andWhere('deletedAt IS NULL')
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/delegateVoteForm',
        e,
      );
    }
  }

  /* crew 삭제에 따른 voteForm 삭제 */
  async deleteVoteFormByCrew(crewId: number): Promise<UpdateResult> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      return await this.voteFormRepository
        .createQueryBuilder('voteform')
        .update(VoteForm)
        .set({ deletedAt: today })
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteFormRepository/deleteVoteFormByCrew',
        e,
      );
    }
  }
}
