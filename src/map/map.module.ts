import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from 'src/crew/entities/crew.entity';
import { MapRepository } from './map.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Crew])],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}
