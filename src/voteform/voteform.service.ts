import { Injectable } from '@nestjs/common';
import { VoteFormRepository } from './voteform.repository';
import { CreateVoteFormDto } from './dto/createVoteForm.dto';
import { EditVoteFormDto } from './dto/editVoteForm.dto';

@Injectable()
export class VoteFormService {
  constructor(private readonly voteFormRespository: VoteFormRepository) {}

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
  async findAllVoteForm(crewId: number): Promise<any> {
    const voteForm = await this.voteFormRespository.findAllVoteForm(crewId);
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
}
