import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiCollection } from '../../api-collections/entities/api-collection.entity';
import { EnvVariable } from '../../envs/entities/env-variable.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ApiCollection, (apiCollection) => apiCollection.project)
  apiCollections: ApiCollection[];

  @OneToMany(() => EnvVariable, (envVariable) => envVariable.project)
  envVariables: EnvVariable[];
}
