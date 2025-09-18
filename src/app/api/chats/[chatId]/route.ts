import { connectToDB } from '@/lib/mongoose';
import Chat from '@/models/Chat';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { z } from 'zod'
import { authOptions } from '@/lib/authOptions';



const ALLOWED_ORIGIN: string = process.env.ALLOWED_ORIGIN!;


export async function GET(req: NextRequest, context: {params: Promise<{ chatId: string}>}){
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

	try {
		const params = await context.params;
		const chatId = params.chatId;
		const chat = await Chat.findById(chatId);

		if (!chat) {
		return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
		}

		return NextResponse.json(chat);
	} catch {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
};



const messageSchema = z.object({
  	role: z.enum(['user', 'system']),
  	content: z.string().min(1, { message: 'Message text is required' }),
  	timestamp: z.preprocess(
		(arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
    z.date()
  	).optional(),
});

const messagesArraySchema = z.array(messageSchema);


export async function PATCH(req: NextRequest, context: {params: Promise<{ chatId: string}>}) {
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

	const params = await context.params;
	const chatId = params.chatId;
  	const body = await req.json();
  	const { newMessages } = body;


  	if (!Array.isArray(newMessages)) {
    	return NextResponse.json({ message: 'New messages must be an array' }, { status: 400 });
  	};

	const parseResult = messagesArraySchema.safeParse(newMessages);
  	if (!parseResult.success) {
    	return NextResponse.json({ message: 'Invalid messages format', errors: parseResult.error.issues }, { status: 400 });
  	};

  	try {
    	const chat = await Chat.findById(chatId);
    	if (!chat) {
     		return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    	}

    	if (chat.userId.toString() !== user._id.toString()) {
      		return NextResponse.json({ message: 'No access to this chat' }, { status: 403 });
    	}
	
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: { $each: parseResult.data } } },
	  { new: true }
    );


    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    console.error('[PATCH /api/chats/[chatId]]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};


export async function DELETE(req: NextRequest, context: {params: Promise<{ chatId: string}>}) {
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

	const params = await context.params;
	const chatId = params.chatId;

	const chat = await Chat.findById(chatId);
	if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

	if (chat.userId.toString() !== session.user?.id) {
    	return NextResponse.json({ error: 'No access' }, { status: 403 });
  	}

	await Chat.findByIdAndDelete(chatId);

 	return NextResponse.json({ message: 'Chat deleted' }, { status: 200 });
};