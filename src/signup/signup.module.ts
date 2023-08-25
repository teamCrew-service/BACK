import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { SignupFormRepository } from './signupForm.repository';
import { SignupForm } from './entities/signupForm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingupRepository } from './signup.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SignupForm])],
  controllers: [SignupController],
  providers: [SignupService, SignupFormRepository, SingupRepository],
  exports: [SignupService, SignupFormRepository, SingupRepository],
})
export class SignupModule {}
