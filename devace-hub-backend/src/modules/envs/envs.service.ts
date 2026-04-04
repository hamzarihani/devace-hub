import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from './entities/env-variable.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateEnvVariableDto } from './dto/create-env-variable.dto';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class EnvsService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;

  constructor(
    @InjectRepository(EnvVariable)
    private readonly envVariableRepository: Repository<EnvVariable>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('CRYPTO_SECRET') || 'your-default-32-char-secret-key-!!';
    this.key = Buffer.from(secret.padEnd(32, '0').slice(0, 32));
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(text: string): string {
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      return '[Decryption Error]';
    }
  }

  async create(user: User, dto: CreateEnvVariableDto): Promise<EnvVariable> {
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId, user: { id: user.id } },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${dto.projectId}" not found`);
    }

    const encryptedValue = this.encrypt(dto.value);

    const envVariable = this.envVariableRepository.create({
      key: dto.key,
      value: encryptedValue,
      project,
    });

    const saved = await this.envVariableRepository.save(envVariable);
    return { ...saved, value: dto.value }; // Return decrypted value for confirmation
  }

  async findByProject(user: User, projectId: string): Promise<EnvVariable[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: user.id } },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    const envs = await this.envVariableRepository.find({
      where: { project: { id: projectId } },
      order: { key: 'ASC' },
    });

    return envs.map((env) => ({
      ...env,
      value: this.decrypt(env.value),
    }));
  }

  async remove(user: User, id: string): Promise<void> {
    const env = await this.envVariableRepository.findOne({
      where: { id },
      relations: ['project', 'project.user'],
    });

    if (!env) {
      throw new NotFoundException(`Environment variable with ID "${id}" not found`);
    }

    if (env.project.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this variable');
    }

    await this.envVariableRepository.remove(env);
  }
}
