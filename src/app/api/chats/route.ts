import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import Chat from "@/models/Chat";


export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

	await connectToDB();

	const body = await req.json();
	const { messages = [] } = body;

	const user = await User.findOne({ email: session.user?.email });
	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	try {
		const chat = await Chat.create({ userId: user._id, messages });
		return NextResponse.json(chat, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
};



export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

	await connectToDB();

	const user = await User.findOne({ email: session.user?.email });
	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });

	return NextResponse.json(chats);
}