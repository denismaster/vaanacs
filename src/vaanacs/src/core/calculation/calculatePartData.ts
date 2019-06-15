import { CriteriaPart, SplinePart } from "../../projects/models/criteria-parts";
import { Value, Criteria } from "../../projects/models/project";
import { start } from "repl";
import { calculateDuration } from "./calculateDuration";
import * as interpolator from 'natural-spline-interpolator';

function isPartDefinedAtGivenTime(part: CriteriaPart, time: number): boolean {
    return part.startTime <= time && time <= (part.endTime || Number.MAX_VALUE);
}

export function calculateCriteria(criteria: Criteria, measurementCount: number) {
    let timeSeries: Value[] = [];

    let t = 0;

    if (!criteria.parts || !criteria.parts.length) {
        throw new Error("Invalid criteria parts");
    }

    let spline: (t: number) => number;

    if (criteria.parts.length == 1) {
        console.log(criteria.parts[0])

        if (criteria.parts[0].type === 'spline') {
            spline = interpolator(zipPointsForSpline(criteria.parts[0] as SplinePart));
            console.log("spline is:", spline)
        }

        while (t <= measurementCount) {
            if (criteria.parts[0].type === "spline") {
                timeSeries.push({ t, v: calculatePartAtTime(criteria.parts[0], t, spline) })
            }
            else {
                timeSeries.push({ t, v: calculatePartAtTime(criteria.parts[0], t) })
            }
            t++;
        }
    }
    else {
        let i = 0;
        while (t <= measurementCount) {
            let activePart = criteria.parts[i]

            if (!activePart) break;

            if (activePart.type === "spline") {
                let points = zipPointsForSpline(activePart);
                console.log(points);
                spline = interpolator(points);
                console.log("spline is:", spline)
            }

            while (t <= measurementCount && isPartDefinedAtGivenTime(activePart, t)) {
                if (activePart.type === "spline") {
                    timeSeries.push({ t, v: calculatePartAtTime(activePart, t, spline) })
                }
                else {
                    timeSeries.push({ t, v: calculatePartAtTime(activePart, t) })
                }
                t++;
            }

            i++;
        }
    }


    return timeSeries;
}

export function zipPointsForSpline(part: SplinePart) {
    return part.points.map((p) => {
        return [p.t, p.v]
    })
}

export function calculatePartAtTime(part: CriteriaPart, time: number, func?: (t: number) => number): number {
    if (part.type === "spline" && !func) {
        throw new Error("Invalid spline");
    }

    switch (part.type) {
        case "constant": return part.value;
        case "linear": return part.b + part.k * (time - part.startTime || 0);
        case "exponent": return part.b * Math.exp(part.k * (time - part.startTime || 0));
        case "quadratic": return part.b - Math.pow(part.k * (time - part.startTime || 0), 2);
        case "spline": return func(time);
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