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
import { EnvsService } from './envs.service';
import { CreateEnvVariableDto } from './dto/create-env-variable.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('envs')
@UseGuards(JwtAuthGuard)
export class EnvsController {
  constructor(private readonly envsService: EnvsService) {}

  @Post()
  create(@Req() req: any, @Body() createEnvVariableDto: CreateEnvVariableDto) {
    const user = req.user as User;
    return this.envsService.create(user, createEnvVariableDto);
  }

  @Get('project/:projectId')
  findByProject(@Req() req: any, @Param('projectId') projectId: string) {
    const user = req.user as User;
    return this.envsService.findByProject(user, projectId);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const user = req.user as User;
    return this.envsService.remove(user, id);
  }
}
