import { Project, Value } from "../../projects/models/project";
import { calculateCriteria } from "./calculatePartData";
import { calculateDuration } from "./calculateDuration";

export function calculateData(project: Project): Value[] {
    let { convolution, criterias } = project;

    const measurementCount = calculateDuration(project);

    if (!criterias || !criterias.length)
        return [];

    let rnd = Math.random();


    criterias = [
        {
            name: "1",
            weight: rnd,
            parts: [
                {
                    type: "constant",
                    startTime: 0,
                    value: 100
                }
            ]
        },
        {
            name: "2",
            weight: 1-rnd,
            parts: [
                {
                    type: "exponent",
                    startTime: 0,
                    b: 100,
                    k: -0.24
                }
            ]
        }
    ]

    return criterias
        .map(c => ({ c, data: calculateCriteria(c, measurementCount) }))
        .reduce((previous: Value[], { c, data }) => {
            if (!previous || !previous.length) {
                return calculateCriteria(c, measurementCount).map((el, t) => ({ t, v: el.v * c.weight }))
            }
            return previous.map((el, index) => ({ t: index, v: el.v + c.weight * data[index].v }))
        }, []);
}
