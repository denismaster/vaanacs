import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, Criteria, ConvolutionType, Value } from "./models/project";
import { Model } from 'mongoose';
import { CreateProjectDto } from './models/create-project-dto';
import { UpdateProjectDto } from './models/update-project-dto';
import { calculateData } from '../core/calculation/calculateData';

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

        let project = await this.projectModel.findOne(conditions);

        let calculatedData = calculateData(project);

        let patch = { ...projectPatch, calculatedData: calculatedData}

        const updatedProject = await this.projectModel
            .findOneAndUpdate(conditions, patch, { new: true, useFindAndModify: false });
        return updatedProject;
    }

    async findById(projectId:string): Promise<Project> {
        return await this.projectModel.findById(projectId).exec();
    }

    async findAll(): Promise<Project[]> {
        return await this.projectModel.find().exec();
    }
}
