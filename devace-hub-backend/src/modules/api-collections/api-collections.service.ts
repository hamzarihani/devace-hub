import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiCollection } from './entities/api-collection.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateApiCollectionDto } from './dto/create-api-collection.dto';
import { User } from '../users/entities/user.entity';
import axios from 'axios';

@Injectable()
export class ApiCollectionsService {
  constructor(
    @InjectRepository(ApiCollection)
    private readonly apiCollectionRepository: Repository<ApiCollection>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(user: User, dto: CreateApiCollectionDto): Promise<ApiCollection> {
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId, user: { id: user.id } },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${dto.projectId}" not found`);
    }

    const collection = this.apiCollectionRepository.create({
      ...dto,
      project,
    });

    return this.apiCollectionRepository.save(collection);
  }

  async findByProject(user: User, projectId: string): Promise<ApiCollection[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: user.id } },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    return this.apiCollectionRepository.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'DESC' },
    });
  }

  async execute(user: User, id: string): Promise<any> {
    const collection = await this.apiCollectionRepository.findOne({
      where: { id },
      relations: ['project', 'project.user'],
    });

    if (!collection) {
      throw new NotFoundException(`API Collection with ID "${id}" not found`);
    }

    if (collection.project.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to execute this collection');
    }

    try {
      const response = await axios({
        method: collection.method,
        url: collection.url,
        headers: collection.headers,
        data: collection.body,
        validateStatus: () => true,
      });

      return {
        status: response.status,
        headers: response.headers,
        data: response.data,
      };
    } catch (error: any) {
      return {
        status: error.response?.status || 500,
        headers: error.response?.headers || {},
        data: error.response?.data || { message: error.message },
      };
    }
  }
}
