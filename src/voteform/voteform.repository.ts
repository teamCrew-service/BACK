import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoteForm } from './entities/voteform.entity';
import { CreateVoteFormDto } from './dto/createVoteForm.dto';
import { EditVoteFormDto } from './dto/editVoteForm.dto';

@Injectable()
export class VoteFormRepository {
  constructor(
    @InjectRepository(VoteForm)
    private voteFormRepository: Repository<VoteForm>,
  ) {}

  /* 투표 공지 등록 */
  async createVoteForm(
    userId: number,
    crewId: number,
    createVoteFormDto: CreateVoteFormDto,
  ): Promise<any> {
    const voteForm = new VoteForm();
    voteForm.userId = userId;
    voteForm.crewId = crewId;
    voteForm.voteTitle = createVoteFormDto.voteFormTitle;
    voteForm.voteContent = createVoteFormDto.voteFormContent;
    voteForm.multipleVotes = createVoteFormDto.multipleVotes;
    voteForm.anonymousVote = createVoteFormDto.anonymousVote;
    voteForm.voteEndDate = createVoteFormDto.voteFormEndDate;
    voteForm.voteOption1 = createVoteFormDto.voteFormOption1;
    voteForm.voteOption2 = createVoteFormDto.voteFormOption2;
    voteForm.voteOption3 = createVoteFormDto.voteFormOption3;
    voteForm.voteOption4 = createVoteFormDto.voteFormOption4;
    voteForm.voteOption5 = createVoteFormDto.voteFormOption5;
    await this.voteFormRepository.save(voteForm);
    return voteForm;
  }

  /* 투표 공지 전체 목록 조회 */
  async findAllVoteForm(crewId: number): Promise<any> {
    const voteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .select([
        'voteFormId',
        'crewId',
        'voteTitle',
        'voteContent',
        'voteEndDate',
        'voteIsDone',
      ])
      .where('voteform.crewId = :crewId', { crewId })
      .andWhere('voteform.deletedAt IS NULL')
      .orderBy('voteform.voteEndDate', 'ASC')
      .getRawMany();
    return voteForm;
  }

  /* 투표 공지 상세 조회 */
  async findVoteFormDetail(crewId: number, voteFormId: number): Promise<any> {
    const voteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .where('voteform.crewId = :crewId', { crewId })
      .andWhere('voteform.voteFormId = :voteFormId', { voteFormId })
      .select([
        'voteFormId',
        'voteTitle',
        'voteContent',
        'multipleVotes',
        'anonymousVote',
        'voteEndDate',
        'voteOption1',
        'voteOption2',
        'voteOption3',
        'voteOption4',
        'voteOption5',
      ])
      .getRawOne();
    return voteForm;
  }

  /* 투표 공지가 익명 투표인지 확인 */
  async findVoteFormForAnonymous(
    crewId: number,
    voteFormId: number,
  ): Promise<any> {
    const voteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .select(['voteFormId', 'anonymousVote'])
      .where('crewId = :crewId', { crewId })
      .andWhere('voteFormId = :voteFormId', { voteFormId })
      .getRawOne();
    return voteForm;
  }

  /* 투표 공지 수정 */
  async editVoteForm(
    crewId: number,
    voteFormId: number,
    editVoteFormDto: EditVoteFormDto,
  ): Promise<any> {
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

    const editedVoteForm = await this.voteFormRepository.update(
      { crewId, voteFormId },
      {
        voteTitle: voteFormTitle,
        voteContent: voteFormContent,
        voteEndDate: voteFormEndDate,
        multipleVotes: multipleVotes,
        anonymousVote: anonymousVote,
        voteOption1: voteFormOption1,
        voteOption2: voteFormOption2,
        voteOption3: voteFormOption3,
        voteOption4: voteFormOption4,
        voteOption5: voteFormOption5,
      },
    );

    return editedVoteForm;
  }

  /* 투표 공지 삭제 */
  async deleteVoteForm(crewId: number, voteFormId: number): Promise<any> {
    const koreaTimezoneOffset = 9 * 60;
    const currentDate = new Date();
    const today = new Date(currentDate.getTime() + koreaTimezoneOffset * 60000);
    const deleteVoteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .update(VoteForm)
      .set({ deletedAt: today })
      .where('crewId = :crewId', { crewId })
      .andWhere('voteFormId = :voteFormId', { voteFormId })
      .execute();
    return deleteVoteForm;
  }

  /* 오늘 날짜 기준보다 날짜가 지난 투표를 찾아 IsDone을 true로 전환 */
  async updateVoteIsDone(): Promise<any> {
    const koreaTimezoneOffset = 9 * 60;
    const currentDate = new Date();
    const today = new Date(currentDate.getTime() + koreaTimezoneOffset * 60000);
    await this.voteFormRepository
      .createQueryBuilder('voteform')
      .update(VoteForm)
      .set({ voteIsDone: true })
      .where('voteEndDate < :today', { today })
      .andWhere('voteIsDone = :voteIsDone', { voteIsDone: false })
      .execute();
  }

  /* 위임에 따라 투표 위임하기 */
  async delegateVoteForm(delegator: number, crewId: number): Promise<any> {
    await this.voteFormRepository
      .createQueryBuilder('voteform')
      .update(VoteForm)
      .set({ userId: delegator })
      .where('crewId = :crewId', { crewId })
      .andWhere('deletedAt IS NULL')
      .execute();
  }
}
