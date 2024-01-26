import { Injectable } from '@nestjs/common';
import { VoteRepository } from '@src/vote/vote.repository';
import { VotingDto } from '@src/vote/dto/voting.dto';
import { EditVotingDto } from '@src/vote/dto/editVoting.dto';

@Injectable()
export class VoteService {
  constructor(private readonly voteRepository: VoteRepository) {}

  /* 투표하기 */
  async voting(
    userId: number,
    crewId: number,
    voteFormId: number,
    votingDto: VotingDto,
  ): Promise<any> {
    try {
      return await this.voteRepository.voting(
        userId,
        crewId,
        voteFormId,
        votingDto,
      );
    } catch (e) {
      console.error(e);
      throw new Error('VoteService/voting');
    }
  }

  /* 투표 확인하기 */
  async findAllVote(crewId: number, voteFormId: number): Promise<any> {
    try {
      const vote = await this.voteRepository.findAllVote(crewId, voteFormId);
      return vote;
    } catch (e) {
      console.error(e);
      throw new Error('VoteService/findAllVote');
    }
  }

  /* 익명 투표 확인하기 */
  async findAllAnonymousVote(crewId: number, voteFormId: number): Promise<any> {
    try {
      const vote = await this.voteRepository.findAllAnonymousVote(
        crewId,
        voteFormId,
      );
      return vote;
    } catch (e) {
      console.error(e);
      throw new Error('VoteService/findAllAnonymousVote');
    }
  }

  /* 투표 수정하기 */
  async editVote(
    userId: number,
    crewId: number,
    voteFormId: number,
    editVotingDto: EditVotingDto,
  ): Promise<any> {
    try {
      const editedVote = await this.voteRepository.editVote(
        userId,
        crewId,
        voteFormId,
        editVotingDto,
      );
      return editedVote;
    } catch (e) {
      console.error(e);
      throw new Error('VoteService/editVote');
    }
  }

  /* crew 삭제에 따라 투표 삭제하기 */
  async deleteVoteByCrew(crewId: number): Promise<any> {
    try {
      const deleteVote = await this.voteRepository.deleteVoteByCrew(crewId);
      return deleteVote;
    } catch (e) {
      console.error(e);
      throw new Error('VoteService/deleteVoteByCrew');
    }
  }
}
