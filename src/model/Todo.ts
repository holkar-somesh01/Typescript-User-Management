import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
    title: string;
    description: string;
    isCompleted: Boolean;
    hero: string,
    priority: string;
    skills: string[];
    taskType: string;
}
const todoSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        photo: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
        },
        taskType: {
            type: String,
            enum: ['Bug', 'Feature',],
        },
        skills: {
            type: [String],
            required: true,
        },
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;