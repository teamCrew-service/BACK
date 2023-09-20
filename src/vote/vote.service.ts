import { Injectable } from '@nestjs/common';
import { VoteRepository } from './vote.repository';
import { VotingDto } from './dto/voting.dto';
import { EditVotingDto } from './dto/editVoting.dto';

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
    const vote = await this.voteRepository.voting(
      userId,
      crewId,
      voteFormId,
      votingDto,
    );
    return vote;
  }

  /* 투표 확인하기 */
  async findAllVote(crewId: number): Promise<any> {
    const voteDetail = await this.voteRepository.findAllVote(crewId);
    return voteDetail;
  }

  /* 투표 수정하기 */
  async editVote(
    userId: number,
    crewId: number,
    voteFormId: number,
    editVotingDto: EditVotingDto,
  ): Promise<any> {
    const editedVote = await this.voteRepository.editVote(
      userId,
      crewId,
      voteFormId,
      editVotingDto,
    );
    return editedVote;
  }
}
