import { Project, Value, Criteria } from "../../projects/models/project";
import { calculateCriteria } from "./calculatePartData";
import { calculateDuration } from "./calculateDuration";

export function calculateData(project: Project): Value[] {
    let { convolution, criterias } = project;

    const measurementCount = calculateDuration(project);

    if (!criterias || !criterias.length)
        return [];

    return project.criterias
        .map(c => ({ c, data: calculateCriteria(c, measurementCount) }))
        .reduce((previous: Value[], { c, data }) => {
            if (!previous || !previous.length) {
                return calculateCriteria(c, measurementCount).map((el, t) => ({ t, v: el.v * c.weight }))
            }
            return previous.map((el, index) => ({ t: index, v: el.v + c.weight * data[index].v }))
        }, []);
}
