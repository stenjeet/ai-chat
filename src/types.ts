import { Types } from "mongoose"

export enum RoleMessage{
	USER = 'user',
	SYSTEM = 'system'
};

export interface IMessage {
	role: RoleMessage,
	text: string,
	timestamp?: Date
};

export interface IChat {
	_id: Types.ObjectId
	userId: string,
	messages: IMessage[],
	createdAt: Date
};

export interface IUser extends Document {
	email: string,
	name?: string,
	password: string,
	createdAt: Date,
};