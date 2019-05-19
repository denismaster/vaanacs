import { Project, Value } from "../../projects/models/project";
import { calculateCriteria } from "./calculatePartData";
import { calculateDuration } from "./calculateDuration";

export function calculateData(project: Project): Value[] {
    let { convolution, criterias } = project;

    const measurementCount = calculateDuration(project);

    if (!criterias || !criterias.length)
        return [];

    return criterias.reduce((previous, current) => {
        if (!previous.length) {
            return calculateCriteria({
                name: "1",
                weight: 2,
                parts: [{ type: 'constant', startTime: 0, endTime: 10, value: 25 },
                {
                    type: "quadratic", startTime: 10, k: -0.15, b: 25
                }]
            }, measurementCount);
        }
    }, [])
}
