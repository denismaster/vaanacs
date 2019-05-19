import { Project } from "../../projects/models/project";
import * as moment from 'moment';

export function calculateDuration(project: Project): number {
    const { startTime, endTime, step } = project;

    const startMoment = moment(startTime);
    const finishMomemnt = endTime ? moment(endTime) : moment();

    return finishMomemnt.diff(startMoment, step);
}