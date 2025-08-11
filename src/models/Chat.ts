import mongoose, { Schema } from "mongoose";



const messageSchema = new Schema({
	role: {type: String, enum: ['user', 'assistant'], required: true},
	text: {type: String, required: true},
	timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
	userId: {type: Schema.Types.ObjectId, required: true},
	messages: [messageSchema],
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);