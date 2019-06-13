import { Value } from "./project";

export interface ConstantCriteriaAddDto {
    type: "constant"
    name: string,
    weight: number;
    value: number;
}

export interface LinearCriteriaAddDto {
    type: "linear"
    name: string,
    weight: number;
    b: number,
    k: number
}

export interface QuadraticCriteriaAddDto {
    type: "quadratic"
    name: string,
    weight: number;
    k: number
    b: number;
}

export interface ExponentCriteriaAddDto {
    type: "exponent"
    name: string,
    weight: number;
    k: number
    b: number;
}

export interface SplineCriteriaAddDto {
    type: "spline"
    name: string,
    weight: number;
    points: Value[]
}

export type CriteriaAddDto = ConstantCriteriaAddDto
    | LinearCriteriaAddDto
    | QuadraticCriteriaAddDto
    | ExponentCriteriaAddDto
    | SplineCriteriaAddDto