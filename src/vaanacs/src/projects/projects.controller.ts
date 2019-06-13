import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './models/create-project-dto';
import { Project } from './models/project';
import { UpdateProjectDto } from './models/update-project-dto';
import { CriteriaAddDto } from './models/criteria-add-dto';

@Controller('api/projects')
export class ProjectsController {

  constructor(private service: ProjectsService) {  }
  
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
    return await this.service.update(id, patchProjectDto);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id:string) {
    return await this.service.delete(id);
  }

  @Post(":projectId/criterias")
  async addCriteria(@Param('projectId') projectId: string, @Body() criteriaAddDto: CriteriaAddDto): Promise<Project> {
    console.log(criteriaAddDto);
    return await this.service.addCriteria(projectId, criteriaAddDto);
  }
}
