import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './models/create-project-dto';

export interface Project {
  name: string;
  description?: string;
}

@Controller('api/projects')
export class ProjectsController {

  constructor(private service: ProjectsService) {

  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.service.create(createProjectDto);
  }

  @Get()
  async getProjects(): Promise<Project[]> {
    return await this.service.findAll();
  }
}
