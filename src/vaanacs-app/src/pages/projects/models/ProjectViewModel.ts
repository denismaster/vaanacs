export interface ProjectViewModel {
    name: string;
    description: string;
    stars: number;
    tags: string[];

    minAcceptableEfficiency: number;
    criterias: {
        name: string
    }[]
}