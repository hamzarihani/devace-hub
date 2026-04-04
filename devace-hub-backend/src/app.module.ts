import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ApiCollectionsModule } from './modules/api-collections/api-collections.module';
import { DockerModule } from './modules/docker/docker.module';
import { EnvsModule } from './modules/envs/envs.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ApiCollectionsModule,
    DockerModule,
    EnvsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
