import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './projects.controller';
import { Model } from 'mongoose';

export interface CreateProjectDto {
    name: string;
    description?: string;
}

@Injectable()
export class ProjectsService {
    constructor(@InjectModel('Project') private readonly projectModel: Model<Project>) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const createdProject = new this.projectModel(createProjectDto);
        return await createdProject.save();
    }

    async findAll(): Promise<Project[]> {
        return await this.projectModel.find().exec();
    }
}
