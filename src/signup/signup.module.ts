import { Module, forwardRef } from '@nestjs/common';
import { SignupController } from '@src/signup/signup.controller';
import { SignupService } from '@src/signup/signup.service';
import { SignupFormRepository } from '@src/signup/signupForm.repository';
import { Signupform } from '@src/signup/entities/signupForm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupRepository } from '@src/signup/signup.repository';
import { Signup } from '@src/signup/entities/signup.entity';
import { MemberModule } from '@src/member/member.module';
import { CrewModule } from '@src/crew/crew.module';
import { LeavecrewModule } from '@src/leavecrew/leavecrew.module';
import { ChatModule } from '@src/chat/chat.module';
import { ImageModule } from '@src/image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Signupform, Signup]),
    // 순환 의존성
    forwardRef(() => MemberModule),
    forwardRef(() => CrewModule),
    forwardRef(() => LeavecrewModule),
    forwardRef(() => ChatModule),
    forwardRef(() => ImageModule),
  ],
  controllers: [SignupController],
  providers: [SignupService, SignupFormRepository, SignupRepository],
  exports: [SignupService, SignupFormRepository, SignupRepository],
})
export class SignupModule {}
