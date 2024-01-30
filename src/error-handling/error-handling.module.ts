import { Global, Module } from '@nestjs/common';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Global() // 글로벌로 모든 모듈에 의존성 주입
@Module({
  providers: [ErrorHandlingService],
  exports: [ErrorHandlingService],
})
export class ErrorHandlingModule {}
