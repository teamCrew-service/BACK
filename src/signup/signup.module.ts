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

@Module({
  imports: [
    TypeOrmModule.forFeature([Signupform, Signup]),
    forwardRef(() => MemberModule),
    forwardRef(() => CrewModule),
  ],
  controllers: [SignupController],
  providers: [SignupService, SignupFormRepository, SignupRepository],
  exports: [SignupService, SignupFormRepository, SignupRepository],
})
export class SignupModule {}
