import { CriteriaPart } from "./criteria-parts";

export type ConvolutionType = "additive" | "multiplicative" | "chebyshev";

export type Step = "day" | "week" | "month" | "year";

export interface Value {
  t: number;
  v: number;
}

export interface Criteria {
  name: string,
  parts: CriteriaPart[],
  weight: number;
}

export class Project {
  id: string;
  name: string;
  description?: string;
  tags: string[];

  startTime: Date;
  endTime: Date;
  step: Step;

  minAcceptableEfficiency: number;
  convolution: ConvolutionType;
  criterias: Criteria[];

  calculatedData: Value[]
}