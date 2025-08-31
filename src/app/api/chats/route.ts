import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import Chat from "@/models/Chat";
import { authOptions } from "@/lib/authOptions";



const ALLOWED_ORIGIN: string = process.env.ALLOWED_ORIGIN!;


export async function POST(req: NextRequest) {
	const origin = req.headers.get('origin');
	const referer = req.headers.get('referer');
	
	if (origin && origin !== ALLOWED_ORIGIN) {
		return NextResponse.json({ error: 'Forbidden: invalid origin' }, { status: 403 });
	};
	if (referer && !referer.startsWith(ALLOWED_ORIGIN)) {
		return NextResponse.json({ error: 'Forbidden: invalid referer' }, { status: 403 });
	};


	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	await connectToDB();

	const body = await req.json();
	const { messages = [] } = body;
	if (!Array.isArray(messages)) {
  		return NextResponse.json({ error: "Messages must be an array" }, { status: 400 });
	};

	const user = await User.findOne({ email: session.user?.email });
	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	try {
		const chat = await Chat.create({ userId: user._id, messages });
		return NextResponse.json(chat, { status: 201 });
	} catch {
		return NextResponse.json({ error: 'Server error' }, { status: 400 });
	}
};



export async function GET(req: Request) {
	const origin = req.headers.get('origin');
	const referer = req.headers.get('referer');
	
	if (origin && origin !== ALLOWED_ORIGIN) {
		return NextResponse.json({ error: 'Forbidden: invalid origin' }, { status: 403 });
	};
	if (referer && !referer.startsWith(ALLOWED_ORIGIN)) {
		return NextResponse.json({ error: 'Forbidden: invalid referer' }, { status: 403 });
	};


	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	await connectToDB();

	const user = await User.findOne({ email: session.user?.email });
	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });

	return NextResponse.json(chats);
}