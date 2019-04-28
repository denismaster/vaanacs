
import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
    name: String,
    description: { type: String, default: null },
    userId: { type: String, default: 0 }
});