import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, Criteria } from "./models/project";
import { Model } from 'mongoose';
import { CreateProjectDto } from './models/create-project-dto';
import { UpdateProjectDto } from './models/update-project-dto';
import { calculateData } from '../core/calculation/calculateData';
import { CriteriaAddDto } from './models/criteria-add-dto';
import { CriteriaPart } from './models/criteria-parts';
import { findExtremumPoints } from 'src/core/calculation/extremum';
import { findRoots } from 'src/core/calculation/findRoots';

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
        let extremumPoints = findExtremumPoints(calculatedData);
        let roots = findRoots(project.minAcceptableEfficiency, calculatedData);

        let patch = { ...projectPatch, calculatedData: calculatedData, roots, extremumPoints }

        const updatedProject = await this.projectModel
            .findOneAndUpdate(conditions, patch, { new: true, useFindAndModify: false });
        return updatedProject;
    }

    async addCriteria(projectId, addCriteria: CriteriaAddDto): Promise<Project> {
        const conditions = {
            _id: projectId
        };

        let project = await (this.projectModel.findOne(conditions).exec())

        let parts: CriteriaPart[] = [];

        switch (addCriteria.type) {
            case "constant":
                parts.push({
                    type: "constant",
                    value: addCriteria.value
                });
                break;

            case "linear":
                parts.push({
                    type: addCriteria.type,
                    k: addCriteria.k,
                    b: addCriteria.b
                });
                break;

            case "exponent":
                parts.push({
                    type: addCriteria.type,
                    k: addCriteria.k,
                    b: addCriteria.b
                });
                break;

            case "quadratic":
                parts.push({
                    type: addCriteria.type,
                    k: addCriteria.k,
                    b: addCriteria.b
                });
                break;

            case "spline":
                parts.push({
                    type: addCriteria.type,
                    points: addCriteria.points
                })
        }

        let criteria: Criteria = {
            name: addCriteria.name,
            weight: addCriteria.weight,
            parts
        }
        
        let existingCriterias = project.criterias || [];

        let patch = { criterias: [...existingCriterias, criteria] }

        let updatedProject = await this.projectModel
            .findOneAndUpdate(conditions, patch, { new: true, useFindAndModify: false });

        let calculatedData = calculateData(updatedProject);
        let extremumPoints = findExtremumPoints(calculatedData);
        let roots = findRoots(project.minAcceptableEfficiency, calculatedData);

        let patch2 = { calculatedData, roots, extremumPoints }

        updatedProject = await this.projectModel
            .findOneAndUpdate(conditions, patch2, { new: true, useFindAndModify: false });

        return updatedProject;
    }

    async findById(projectId: string): Promise<Project> {
        return await this.projectModel.findById(projectId).exec();
    }

    async findAll(): Promise<Project[]> {
        return await this.projectModel.find().exec();
    }

    async delete(projectId: string) {
        const conditions = {
            _id: projectId
        };

        return await this.projectModel.findOneAndDelete(conditions)
    }
}
