import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiCollectionsService } from './api-collections.service';
import { CreateApiCollectionDto } from './dto/create-api-collection.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('api-collections')
@UseGuards(JwtAuthGuard)
export class ApiCollectionsController {
  constructor(private readonly apiCollectionsService: ApiCollectionsService) {}

  @Post()
  create(@Req() req: any, @Body() createApiCollectionDto: CreateApiCollectionDto) {
    const user = req.user as User;
    return this.apiCollectionsService.create(user, createApiCollectionDto);
  }

  @Get('project/:projectId')
  findByProject(@Req() req: any, @Param('projectId') projectId: string) {
    const user = req.user as User;
    return this.apiCollectionsService.findByProject(user, projectId);
  }

  @Post(':id/execute')
  execute(@Req() req: any, @Param('id') id: string) {
    const user = req.user as User;
    return this.apiCollectionsService.execute(user, id);
  }
}
