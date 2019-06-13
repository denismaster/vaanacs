export interface CriteriaPart {
    type: string,
    startTime?: number;
    endTime?: number;
}

export interface Criteria {
    name: string,
    parts: CriteriaPart[],
    weight: number;
}

export interface Value {
    t: number;
    v: number;
}

export interface ProjectViewModel {
    _id: string;
    name: string;
    description: string;
    stars: number;
    tags: string[];

    minAcceptableEfficiency: number;
    criterias: Criteria[],

    calculatedData: Value[]

    startTime: Date;
    endTime: Date | undefined;
}