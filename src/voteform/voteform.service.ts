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
    await this.voteFormRespository.updateVoteIsDone();
  }

  /* 투표 공지 등록 */
  async createVoteForm(
    userId: number,
    crewId: number,
    createVoteFormDto: CreateVoteFormDto,
  ): Promise<any> {
    const voteForm = await this.voteFormRespository.createVoteForm(
      userId,
      crewId,
      createVoteFormDto,
    );
    return voteForm;
  }

  /* 투표 공지 전체 목록 조회 */
  async findAllVoteForm(crewId: number, userId: number): Promise<any> {
    const voteForm = await this.voteFormRespository.findAllVoteForm(
      crewId,
      userId,
    );
    return voteForm;
  }

  /* 투표 공지 상세 조회 */
  async findVoteFormDetail(crewId: number, voteFormId: number): Promise<any> {
    const voteForm = await this.voteFormRespository.findVoteFormDetail(
      crewId,
      voteFormId,
    );
    return voteForm;
  }

  /* 투표 공지가 익명 투표인지 확인 */
  async findVoteFormForAnonymous(
    crewId: number,
    voteFormId: number,
  ): Promise<any> {
    const voteForm = await this.voteFormRespository.findVoteFormForAnonymous(
      crewId,
      voteFormId,
    );
    return voteForm;
  }

  /* 투표 공지 수정 */
  async editVoteForm(
    crewId: number,
    voteFormId: number,
    editVoteFormDto: EditVoteFormDto,
  ): Promise<any> {
    const editedVoteForm = await this.voteFormRespository.editVoteForm(
      crewId,
      voteFormId,
      editVoteFormDto,
    );
    return editedVoteForm;
  }

  /* 투표 공지 삭제 */
  async deleteVoteForm(crewId: number, voteFormId: number): Promise<any> {
    const editedVoteForm = await this.voteFormRespository.deleteVoteForm(
      crewId,
      voteFormId,
    );
    return editedVoteForm;
  }

  /* 위임에 따라 투표 위임하기 */
  async delegateVoteForm(delegator: number, crewId: number): Promise<any> {
    await this.voteFormRespository.delegateVoteForm(delegator, crewId);
    return '투표 공지 위임 완료';
  }

  /* crew 삭제에 따른 voteForm 삭제 */
  async deleteVoteFormByCrew(crewId: number): Promise<any> {
    const deleteVoteForm = await this.voteFormRespository.deleteVoteFormByCrew(
      crewId,
    );
    return deleteVoteForm;
  }
}
