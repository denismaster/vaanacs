
import * as mongoose from 'mongoose';

let discriminatorOptions = { discriminatorKey: 'type' };

export const ValueSchema = new mongoose.Schema({
    t: Number,
    v: Number
});

export const CriteriaPartSchema = new mongoose.Schema({
    startTime: { type: Number, default: null },
    endTime: { type: Number, default: null },
}, discriminatorOptions);

export const CriteriaSchema = new mongoose.Schema({
    name: String,
    weight: { type: Number, default: 0 },
    parts: [CriteriaPartSchema]
});

let partsArray = CriteriaSchema.path('parts');

export const ConstantCriteriaPart = partsArray.discriminator('constant', new mongoose.Schema({
    value: Number
}));

export const LinearCriteriaPart = partsArray.discriminator('linear', new mongoose.Schema({
    k: Number,
    b: Number
}));

export const ExponentialCriteriaPart = partsArray.discriminator('exponent', new mongoose.Schema({
    k: Number,
    b: Number
}));

export const QuadraticCriteriaPart = partsArray.discriminator('quadratic', new mongoose.Schema({
    k: Number,
    b: Number
}));

export const SplineCriteriaPart = partsArray.discriminator('spline', new mongoose.Schema({
    points: [ValueSchema]
}));

export const ProjectSchema = new mongoose.Schema({
    name: String,
    description: { type: String, default: null },
    stars: { type: Number, default: 0 },
    tags: [String],
    userId: { type: String, default: "" },

    startTime: { type: Date, default: new Date(2018, 1, 1) },
    endTime: { type: Date },
    step: { type: String, default: "month" },

    minAcceptableEfficiency: { type: Number, default: 0 },
    criterias: [CriteriaSchema],
    convolution: { type: String, default: "additive" },

    extremumPoints: [ValueSchema],
    roots: [ValueSchema],
    calculatedData: [ValueSchema],
});