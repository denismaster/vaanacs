import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from "./models/project";
import { Model } from 'mongoose';
import { CreateProjectDto } from './models/create-project-dto';
import { UpdateProjectDto } from './models/update-project-dto';

@Injectable()
export class ProjectsService {
    constructor(@InjectModel('Project') private readonly projectModel: Model<Project>) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const createdProject = new this.projectModel(createProjectDto);
        return await createdProject.save();
    }

    async update(projectId, projectPatch: UpdateProjectDto): Promise<Project> {
        const conditions = {
            _id: projectId
        };

        const updatedProject = await this.projectModel
            .findOneAndUpdate(conditions, projectPatch, { new: true, useFindAndModify: false });
        return updatedProject;
    }

    async findById(projectId:string): Promise<Project> {
        return await this.projectModel.findById(projectId).exec();
    }

    async findAll(): Promise<Project[]> {
        return await this.projectModel.find().exec();
    }
}
