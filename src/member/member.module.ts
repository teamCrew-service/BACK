import { Module, forwardRef } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { CrewModule } from 'src/crew/crew.module';
import { SignupModule } from 'src/signup/signup.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    forwardRef(() => CrewModule),
    forwardRef(() => SignupModule),
  ],
  providers: [MemberService, MemberRepository],
  exports: [MemberService, MemberRepository],
})
export class MemberModule {}
