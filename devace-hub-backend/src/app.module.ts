import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { dataSourceOptions } from './database/data-source';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOptions,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    ApiCollectionsModule,
    DockerModule,
    EnvsModule,
    // Feature Modules will be added here
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
