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
    voteForm.voteTitle = createVoteFormDto.voteTitle;
    voteForm.voteContent = createVoteFormDto.voteContent;
    voteForm.voteEndDate = createVoteFormDto.voteEndDate;
    voteForm.voteOption1 = createVoteFormDto.voteOption1;
    voteForm.voteOption2 = createVoteFormDto.voteOption2;
    voteForm.voteOption3 = createVoteFormDto.voteOption3;
    voteForm.voteOption4 = createVoteFormDto.voteOption4;
    await this.voteFormRepository.save(voteForm);
    return voteForm;
  }

  /* 투표 공지 전체 목록 조회 */
  async findAllVoteForm(crewId: number): Promise<any> {
    const voteForm = await this.voteFormRepository.find({ where: { crewId } });
    return voteForm;
  }

  /* 투표 공지 상세 조회 */
  async findVoteFormDetail(crewId: number, voteFormId: number): Promise<any> {
    const voteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .leftJoin('voteform.userId', 'users')
      .where('voteform.crewId = :crewId', { crewId })
      .andWhere('votefor.voteFormId = :voteFormId', { voteFormId })
      .select([
        'users.profileImage',
        'users.nickname',
        'voteform.voteTitle',
        'voteform.voteContent',
        'voteform.voteEndDate',
        'voteform.voteOption1',
        'voteform.voteOption2',
        'voteform.voteOption3',
        'voteform.voteOption4',
      ])
      .getRawOne();
    return voteForm;
  }

  /* 투표 공지 수정 */
  async editVoteForm(
    crewId: number,
    voteFormId: number,
    editVoteFormDto: EditVoteFormDto,
  ): Promise<any> {
    const voteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .select([
        'voteTitle',
        'voteContent',
        'voteEndDate',
        'voteOption1',
        'voteOption2',
        'voteOption3',
        'voteOption4',
      ])
      .where('voteform.crewId = :crewId', { crewId })
      .andWhere('voteform.voteFormId = :voteFormId', { voteFormId })
      .getRawOne();

    if (editVoteFormDto.voteTitle !== undefined) {
      voteForm.voteTitle = editVoteFormDto.voteTitle;
    }
    if (editVoteFormDto.voteContent !== undefined) {
      voteForm.voteContent = editVoteFormDto.voteContent;
    }
    if (editVoteFormDto.voteEndDate !== undefined) {
      voteForm.voteEndDate = editVoteFormDto.voteEndDate;
    }
    if (editVoteFormDto.voteOption1 !== undefined) {
      voteForm.voteOption1 = editVoteFormDto.voteOption1;
    }
    if (editVoteFormDto.voteOption2 !== undefined) {
      voteForm.voteOption2 = editVoteFormDto.voteOption2;
    }
    if (editVoteFormDto.voteOption3 !== undefined) {
      voteForm.voteOption3 = editVoteFormDto.voteOption3;
    }
    if (editVoteFormDto.voteOption4 !== undefined) {
      voteForm.voteOption4 = editVoteFormDto.voteOption4;
    }

    const editedVoteForm = await this.voteFormRepository.save(voteForm);

    return editedVoteForm;
  }

  /* 투표 공지 삭제 */
  async deleteVoteForm(crewId: number, voteFormId: number): Promise<any> {
    const voteForm = await this.voteFormRepository
      .createQueryBuilder('voteform')
      .select([
        'voteTitle',
        'voteContent',
        'voteEndDate',
        'voteOption1',
        'voteOption2',
        'voteOption3',
        'voteOption4',
      ])
      .where('voteform.crewId = :crewId', { crewId })
      .andWhere('voteform.voteFormId = :voteFormId', { voteFormId })
      .getRawOne();

    const deleteVoteForm = await this.voteFormRepository.softDelete(voteForm);
    return deleteVoteForm;
  }
}
