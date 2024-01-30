import { Injectable } from '@nestjs/common';
import { VoteRepository } from '@src/vote/vote.repository';
import { VotingDto } from '@src/vote/dto/voting.dto';
import { EditVotingDto } from '@src/vote/dto/editVoting.dto';
import { Vote } from './entities/vote.entity';
import { DeleteResult } from 'typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class VoteService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly voteRepository: VoteRepository,
  ) {}

  /* 투표하기 */
  async voting(
    userId: number,
    crewId: number,
    voteFormId: number,
    votingDto: VotingDto,
  ): Promise<Object> {
    try {
      return await this.voteRepository.voting(
        userId,
        crewId,
        voteFormId,
        votingDto,
      );
    } catch (e) {
      this.errorHandlingService.handleException('VoteService/voting', e);
    }
  }

  /* 투표 확인하기 */
  async findAllVote(crewId: number, voteFormId: number): Promise<Vote[]> {
    try {
      return await this.voteRepository.findAllVote(crewId, voteFormId);
    } catch (e) {
      this.errorHandlingService.handleException('VoteService/findAllVote', e);
    }
  }

  /* 익명 투표 확인하기 */
  async findAllAnonymousVote(
    crewId: number,
    voteFormId: number,
  ): Promise<Vote[]> {
    try {
      return await this.voteRepository.findAllAnonymousVote(crewId, voteFormId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteService/findAllAnonymousVote',
        e,
      );
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
      return await this.voteRepository.editVote(
        userId,
        crewId,
        voteFormId,
        editVotingDto,
      );
    } catch (e) {
      this.errorHandlingService.handleException('VoteService/editVote', e);
    }
  }

  /* crew 삭제에 따라 투표 삭제하기 */
  async deleteVoteByCrew(crewId: number): Promise<DeleteResult> {
    try {
      return await this.voteRepository.deleteVoteByCrew(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'VoteService/deleteVoteByCrew',
        e,
      );
    }
  }
}
