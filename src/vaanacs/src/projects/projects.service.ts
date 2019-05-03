import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from "./models/project";
import { Model } from 'mongoose';
import { CreateProjectDto } from './models/create-project-dto';

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
