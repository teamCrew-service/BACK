import { Module, forwardRef } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { SignupFormRepository } from './signupForm.repository';
import { Signupform } from './entities/signupForm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupRepository } from './signup.repository';
import { Signup } from './entities/signup.entity';
import { MemberModule } from 'src/member/member.module';
import { CrewModule } from 'src/crew/crew.module';
import { LeavecrewModule } from 'src/leavecrew/leavecrew.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Signupform, Signup]),
    // 순환 의존성
    forwardRef(() => MemberModule),
    forwardRef(() => CrewModule),
    forwardRef(() => LeavecrewModule),
    forwardRef(() => ChatModule),
  ],
  controllers: [SignupController],
  providers: [SignupService, SignupFormRepository, SignupRepository],
  exports: [SignupService, SignupFormRepository, SignupRepository],
})
export class SignupModule {}
