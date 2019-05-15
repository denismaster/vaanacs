
import * as mongoose from 'mongoose';

export const CriteriaSchema = new mongoose.Schema({
    name: String,
    weight: { type: Number, default: 0}
});

export const ValueSchema = new mongoose.Schema({
    t: Number,
    v: Number
});

export const ProjectSchema = new mongoose.Schema({
    name: String,
    description: { type: String, default: null },
    stars: { type: Number, default: 0},
    tags: [String],
    userId: { type: String, default: "" },

    minAcceptableEfficiency: { type: Number, default: 0 },
    criterias: [CriteriaSchema],
    convolution: { type: String, default: "additive"},

    calculatedData:[ValueSchema],
    error
});