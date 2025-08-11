import { IUser } from "@/types";
import mongoose, { Schema } from "mongoose";



const UserSchema = new Schema<IUser>({
	email: {type: String, required: true, unique: true, lowercase: true, trim: true},
	name: {type: String},
	password: {type: String, required: true},
	createdAt: {type: Date, default: () => new Date()}
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);