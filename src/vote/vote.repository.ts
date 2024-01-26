import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Vote } from '@src/vote/entities/vote.entity';
import { VotingDto } from '@src/vote/dto/voting.dto';
import { EditVotingDto } from '@src/vote/dto/editVoting.dto';

@Injectable()
export class VoteRepository {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
  ) {}

  /* 투표하기 */
  async voting(
    userId: number,
    crewId: number,
    voteFormId: number,
    votingDto: VotingDto,
  ): Promise<Object> {
    try {
      const voteCotent = votingDto.vote;
      if (voteCotent.includes(',')) {
        const votes = voteCotent.split(',');
        for (const voted of votes) {
          const vote = new Vote();
          vote.userId = userId;
          vote.crewId = crewId;
          vote.voteFormId = voteFormId;
          vote.vote = voted;
          await this.voteRepository.save(vote);
        }
      } else {
        const vote = new Vote();
        vote.userId = userId;
        vote.crewId = crewId;
        vote.voteFormId = voteFormId;
        vote.vote = votingDto.vote;
        await this.voteRepository.save(vote);
      }
      return { message: '투표가 성공적으로 저장되었습니다.' };
    } catch (e) {
      console.error(e);
      throw new Error('VoteRepository/voting');
    }
  }

  /* 투표 확인하기 */
  async findAllVote(crewId: number, voteFormId: number): Promise<Object[]> {
    try {
      return await this.voteRepository
        .createQueryBuilder('vote')
        .leftJoin('vote.userId', 'users')
        .where('vote.crewId = :crewId', { crewId })
        .andWhere('vote.voteFormId = :voteFormId', { voteFormId })
        .select([
          'vote.voteId AS voteId',
          'vote.userId AS userId',
          'users.nickname AS nickname',
          'users.profileImage AS profileImage',
          'vote.crewId AS crewId',
          'vote.voteFormId AS voteFormId',
          'vote.vote AS vote',
        ])
        .groupBy('vote.voteId')
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('VoteRepository/findAllVote');
    }
  }

  /* 익명 투표 확인하기 */
  async findAllAnonymousVote(
    crewId: number,
    voteFormId: number,
  ): Promise<Object[]> {
    try {
      return await this.voteRepository
        .createQueryBuilder('vote')
        .where('crewId = :crewId', { crewId })
        .andWhere('vote.voteFormId = :voteFormId', { voteFormId })
        .select(['voteId', 'crewId', 'voteFormId', 'vote'])
        .groupBy('voteId')
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('VoteRepository/findAllAnonymousVote');
    }
  }

  /* user가 투표한 부분만 조회하기 */
  async findUserVote(
    crewId: number,
    userId: number,
    voteFormId: number,
  ): Promise<Object[]> {
    try {
      return await this.voteRepository
        .createQueryBuilder('vote')
        .select(['userId', 'vote'])
        .where('vote.crewId = :crewId', { crewId })
        .andWhere('vote.voteFormId = :voteFormId', { voteFormId })
        .andWhere('vote.userId = :userId', { userId })
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('VoteRepository/findUserVote');
    }
  }

  /* 투표 수정하기 */
  async editVote(
    userId: number,
    crewId: number,
    voteFormId: number,
    editVotingDto: EditVotingDto,
  ): Promise<Object> {
    try {
      const queryRunner =
        this.voteRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 전 투표 결과 삭제
      const deleteQuery = `DELETE FROM vote WHERE crewId = ? AND voteFormId = ? AND userId = ?`;
      await queryRunner.query(deleteQuery, [crewId, voteFormId, userId]);

      // 새로운 투표 결과 저장
      const voteContent = editVotingDto.vote;
      if (voteContent.includes(',')) {
        const newVotes = voteContent.split(',');
        for (const newVote of newVotes) {
          const vote = new Vote();
          vote.userId = userId;
          vote.crewId = crewId;
          vote.voteFormId = voteFormId;
          vote.vote = newVote;
          await this.voteRepository.save(vote);
        }
      }
      return { message: '수정한 투표를 성공적으로 저장했습니다.' };
    } catch (e) {
      console.error(e);
      throw new Error('VoteRepository/editVote');
    }
  }

  /* crew 삭제에 따라 투표 삭제하기 */
  async deleteVoteByCrew(crewId: number): Promise<DeleteResult> {
    try {
      return await this.voteRepository
        .createQueryBuilder('vote')
        .delete()
        .from(Vote)
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('VoteRepository/deleteVoteByCrew');
    }
  }
}
