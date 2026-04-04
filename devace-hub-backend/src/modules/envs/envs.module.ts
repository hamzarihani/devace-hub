import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvVariable } from './entities/env-variable.entity';
import { Project } from '../projects/entities/project.entity';
import { EnvsService } from './envs.service';
import { EnvsController } from './envs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EnvVariable, Project])],
  controllers: [EnvsController],
  providers: [EnvsService],
  exports: [EnvsService],
})
export class EnvsModule {}
