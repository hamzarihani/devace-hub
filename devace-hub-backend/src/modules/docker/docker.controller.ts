import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { DockerService } from './docker.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('docker')
@UseGuards(JwtAuthGuard)
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get('containers')
  listContainers() {
    return this.dockerService.listContainers();
  }

  @Post(':id/start')
  startContainer(@Param('id') id: string) {
    return this.dockerService.startContainer(id);
  }

  @Post(':id/stop')
  stopContainer(@Param('id') id: string) {
    return this.dockerService.stopContainer(id);
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string) {
    return this.dockerService.getLogs(id);
  }
}
