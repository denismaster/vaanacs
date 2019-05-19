export interface ConstantPart {
    type: 'constant',
    startTime?: number;
    endTime?: number;
    value: number
}

export interface LinearPart {
    type: 'linear',
    startTime?: number;
    endTime?: number;
    b: number,
    k: number
}

export interface ExponentialPart {
    type: 'exponent',
    startTime?: number;
    endTime?: number;
    b: number,
    k: number
}

export interface QuadraticPart {
    type: 'quadratic',
    startTime?: number;
    endTime?: number;
    b: number,
    k: number
}

export type CriteriaPart = ConstantPart | LinearPart | ExponentialPart | QuadraticPart