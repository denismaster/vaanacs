
import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
    name: String,
    description: { type: String, default: null },
    stars: { type: Number, default: 0},
    tags: [String],
    userId: { type: String, default: "" }
});