import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
    const user = req.user as User;
    return this.projectsService.create(user, createProjectDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const user = req.user as User;
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    const user = req.user as User;
    return this.projectsService.findOne(id, user);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const user = req.user as User;
    return this.projectsService.remove(id, user);
  }
}
