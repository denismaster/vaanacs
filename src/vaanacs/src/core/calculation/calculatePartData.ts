import { CriteriaPart } from "../../projects/models/criteria-parts";
import { Value, Criteria } from "../../projects/models/project";
import { start } from "repl";
import { calculateDuration } from "./calculateDuration";

function isPartDefinedAtGivenTime(part: CriteriaPart, time: number): boolean {
    return part.startTime <= time && time <= (part.endTime || Number.MAX_VALUE);
}

export function calculateCriteria(criteria: Criteria, measurementCount: number) {
    let timeSeries: Value[] = [];

    let t = 0;

    if (!criteria.parts || !criteria.parts.length) {
        throw new Error("Invalid criteria parts");
    }

    if (criteria.parts.length == 1) {
        while (t <= measurementCount) {
            timeSeries.push({ t, v: calculatePartAtTime(criteria.parts[0], t) })
            t++;
        }
    }
    else {
        let parts = [...criteria.parts]
        let i = 0;
        while (t <= measurementCount) {
            let activePart = criteria.parts[i]

            if (!activePart) break;

            while (t <= measurementCount && isPartDefinedAtGivenTime(activePart, t)) {
                timeSeries.push({ t, v: calculatePartAtTime(activePart, t) })
                t++;
                console.log(activePart.type);
            }

            i++;
        }
    }


    return timeSeries;
}

export function calculatePartAtTime(part: CriteriaPart, time: number): number {
    switch (part.type) {
        case "constant": return part.value;
        case "linear": return part.b + part.k * (time - part.startTime || 0);
        case "exponent": return part.b * Math.exp(part.k * (time - part.startTime || 0));
        case "quadratic": return part.b - Math.pow(part.k * (time - part.startTime || 0), 2);
    }
}



export class DataInterval {
    type = "Data"
    constructor(public startTime: number, public endTime: number, public data: number[], public initialEfficiency: number = 0) { }

    getEfficiency(time: Date | number) {
        return this.initialEfficiency;
    }
}

export class LinearInterval {
    type = "Linear"
    constructor(public startTime: number, public endTime: number, public k: number, public initialEfficiency: number = 0) { }

    getEfficiency(time: number) {
        return this.initialEfficiency + this.k * (time - this.startTime);
    }
}

export class ExponentialInterval {
    type = "Exponential"
    constructor(public startTime: number, public endTime: number, public k: number, public initialEfficiency: number = 0) { }

    getEfficiency(time: number) {
        return this.initialEfficiency * Math.exp(this.k * (time - this.startTime));
    }
}

export class QuadraticInterval {
    type = "Quadratic"
    constructor(public startTime: number, public endTime: number, public k: number, public initialEfficiency: number = 0) { }

    getEfficiency(time: number) {
        return this.initialEfficiency - Math.pow(this.k * (time - this.startTime), 2);
    }
}

export class BezierInterval {
    type = "Bezier"
    points: { x: number; y: number; }[] = [];
    controlPoints: { x: number; y: number; }[];
    private getPointValue(points: { x: number, y: number }[], t: number) {
        let x, y;
        if (points.length == 1)
            this.points.push(points[0]);
        else {
            let newpoints = new Array(points.length - 1);
            for (let i = 0; i < newpoints.length; i++) {
                x = (1 - t) * points[i].x + t * points[i + 1].x;
                y = (1 - t) * points[i].y + t * points[i + 1].y;
                newpoints[i] = { x, y };
            }
            this.getPointValue(newpoints, t);
        }
    }
    private recalcLine() {
        this.points = []
        let ratio = 1 / (this.endTime - this.startTime);
        // _points = new LinkedList<SharpDX.Vector2>();
        let t = 0;
        var delta = ratio + this.controlPoints.length / 2;
        while (t <= 1) {
            this.getPointValue(this.controlPoints, t);
            t += ratio;
        }
        //Console.WriteLine("Point count:{0}", _points.Count);
    }
    constructor(public startTime: number, public endTime: number, public initialEfficiency: number = 0, ...rest: { x: number, y: number }[]) {
        this.controlPoints = rest;
        this.recalcLine();
    }

    getEfficiency(time: number): number {
        return (this.points[time] || { y: 0 }).y;
    }
}