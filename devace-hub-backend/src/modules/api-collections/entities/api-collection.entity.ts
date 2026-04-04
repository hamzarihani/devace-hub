import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Method } from '../enums/method.enum';
import { Project } from '../../projects/entities/project.entity';

@Entity('api_collections')
export class ApiCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Method,
  })
  method: Method;

  @Column()
  url: string;

  @Column({ type: 'jsonb', default: {} })
  headers: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  body: Record<string, any>;

  @ManyToOne(() => Project, (project) => project.apiCollections, { onDelete: 'CASCADE' })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;
}
