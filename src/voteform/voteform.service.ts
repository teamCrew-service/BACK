import { Injectable } from '@nestjs/common';
import { VoteFormRepository } from './voteform.repository';
import { CreateVoteFormDto } from './dto/createVoteForm.dto';
import { EditVoteFormDto } from './dto/editVoteForm.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class VoteFormService {
  constructor(private readonly voteFormRespository: VoteFormRepository) {}

  @Cron('0 0 * * * *')
  async voteFormCron() {
    try {
      await this.voteFormRespository.updateVoteIsDone();
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/voteFormCron');
    }
  }

  /* 투표 공지 등록 */
  async createVoteForm(
    userId: number,
    crewId: number,
    createVoteFormDto: CreateVoteFormDto,
  ): Promise<any> {
    try {
      const voteForm = await this.voteFormRespository.createVoteForm(
        userId,
        crewId,
        createVoteFormDto,
      );
      return voteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/createVoteForm');
    }
  }

  /* 투표 공지 전체 목록 조회 */
  async findAllVoteForm(crewId: number, userId: number): Promise<any> {
    try {
      const voteForm = await this.voteFormRespository.findAllVoteForm(
        crewId,
        userId,
      );
      return voteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/findAllVoteForm');
    }
  }

  /* 투표 공지 상세 조회 */
  async findVoteFormDetail(crewId: number, voteFormId: number): Promise<any> {
    try {
      const voteForm = await this.voteFormRespository.findVoteFormDetail(
        crewId,
        voteFormId,
      );
      return voteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/findVoteFormDetail');
    }
  }

  /* 투표 공지가 익명 투표인지 확인 */
  async findVoteFormForAnonymous(
    crewId: number,
    voteFormId: number,
  ): Promise<any> {
    try {
      const voteForm = await this.voteFormRespository.findVoteFormForAnonymous(
        crewId,
        voteFormId,
      );
      return voteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/findVoteFormForAnonymous');
    }
  }

  /* 투표 공지 수정 */
  async editVoteForm(
    crewId: number,
    voteFormId: number,
    editVoteFormDto: EditVoteFormDto,
  ): Promise<any> {
    try {
      const editedVoteForm = await this.voteFormRespository.editVoteForm(
        crewId,
        voteFormId,
        editVoteFormDto,
      );
      return editedVoteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/editVoteForm');
    }
  }

  /* 투표 공지 삭제 */
  async deleteVoteForm(crewId: number, voteFormId: number): Promise<any> {
    try {
      const editedVoteForm = await this.voteFormRespository.deleteVoteForm(
        crewId,
        voteFormId,
      );
      return editedVoteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/deleteVoteForm');
    }
  }

  /* 위임에 따라 투표 위임하기 */
  async delegateVoteForm(delegator: number, crewId: number): Promise<any> {
    try {
      await this.voteFormRespository.delegateVoteForm(delegator, crewId);
      return '투표 공지 위임 완료';
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/delegateVoteForm');
    }
  }

  /* crew 삭제에 따른 voteForm 삭제 */
  async deleteVoteFormByCrew(crewId: number): Promise<any> {
    try {
      const deleteVoteForm =
        await this.voteFormRespository.deleteVoteFormByCrew(crewId);
      return deleteVoteForm;
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormService/createVoteForm');
    }
  }
}
