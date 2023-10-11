import { Module } from '@nestjs/common';
import { UnsubscribeService } from './unsubscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [UnsubscribeService],
})
export class UnsubscribeModule {}
