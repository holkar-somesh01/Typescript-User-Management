import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    hobby: string;
    exprience: string;
    photo: string;
    isActive: Boolean;
}
const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false
        },
        hobby: {
            type: String,
            enum: ["read", "play", "code"]
        },
        exprience: {
            type: [String],
        },
        photo: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
