import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './models/create-project-dto';
import { Project } from './models/project';
import { UpdateProjectDto } from './models/update-project-dto';

@Controller('api/projects')
export class ProjectsController {

  constructor(private service: ProjectsService) {

  }
  
  @Get()
  async getProjects(): Promise<Project[]> {
    return await this.service.findAll();
  }

  @Get(':id')
  async getProject(@Param('id') id: string): Promise<Project> {
    return await this.service.findById(id);
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.service.create(createProjectDto);
  }

  @Patch(':id')
  async patchProject(@Param('id') id: string, @Body() patchProjectDto: UpdateProjectDto): Promise<Project> {
    console.log("Patch executing...");
    console.log(JSON.stringify(patchProjectDto));
    return await this.service.update(id, patchProjectDto);
  }
}
