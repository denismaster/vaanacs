import { Controller, Get } from '@nestjs/common';

export interface Project {
    
}

@Controller('projects')
export class ProjectsController {
  @Get()
  getProjects(): Project[] {
    return []
  }
}
