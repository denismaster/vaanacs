import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './models/create-project-dto';
import { Project } from './models/project';
import { UpdateProjectDto } from './models/update-project-dto';
import { CriteriaAddDto } from './models/criteria-add-dto';
import * as parse from 'csv-parse';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer) {
  let stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}

async function parseCSVFromBuffer(buffer: Buffer): Promise<{ time: string, value: string }[]> {
  return new Promise((resolve, reject) => {
    const output: { time: string, value: string }[] = []
    const parser = parse({
      columns: true,
      skip_empty_lines: true
    });
    const stream = bufferToStream(buffer);
    stream.pipe(parser)
      // Use the readable stream api
      .on('readable', function () {
        let record: { time: string, value: string }
        while (record = this.read()) {
          output.push(record)
        }
      })
      // When we are done, test that the parsed output matched what expected
      .on('end', function () {
        return resolve(output);
      });
  })
}

@Controller('api/projects')
export class ProjectsController {

  constructor(private service: ProjectsService) { }

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
  async deleteProject(@Param('id') id: string) {
    return await this.service.delete(id);
  }

  @Post(":projectId/criterias")
  @UseInterceptors(FileInterceptor('file'))
  async addCriteria(@Param('projectId') projectId: string, @Body() criteriaAddDto: CriteriaAddDto, @UploadedFile() file): Promise<Project> {
    if (file && criteriaAddDto.type === "spline") {
      let parsedRecords = await parseCSVFromBuffer(file.buffer);
      criteriaAddDto.points = parsedRecords.map(t => ({ t: Number(t.time), v: Number(t.value) }))
    }

    return await this.service.addCriteria(projectId, criteriaAddDto);
  }
}
