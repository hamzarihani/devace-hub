import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiCollection } from './entities/api-collection.entity';
import { Project } from '../projects/entities/project.entity';
import { ApiCollectionsService } from './api-collections.service';
import { ApiCollectionsController } from './api-collections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiCollection, Project])],
  controllers: [ApiCollectionsController],
  providers: [ApiCollectionsService],
  exports: [ApiCollectionsService],
})
export class ApiCollectionsModule {}
