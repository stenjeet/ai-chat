import { connectToDB } from '@/lib/mongoose';
import Chat from '@/models/Chat';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import User from '@/models/User';
import { getServerSession } from 'next-auth';



export async function GET(req: NextRequest, context: {params: Promise<{ chatId: string}>}){
  await connectToDB();

  try {
	const params = await context.params;
	const chatId = params.chatId;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest, context: {params: Promise<{ chatId: string}>}) {
	
	const session = await getServerSession(authOptions);
  	if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  	await connectToDB();

  	const user = await User.findOne({ email: session.user?.email });
  	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	const params = await context.params;
	const chatId = params.chatId;
  	const body = await request.json();
  	const { newMessages } = body;


  	if (!Array.isArray(newMessages)) {
    	return NextResponse.json({ message: 'New messages must be an array' }, { status: 400 });
  	};	

  	try {
    	const chat = await Chat.findById(chatId);
    	if (!chat) {
     		return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    	}

    	// Проверяем, что чат принадлежит текущему пользователю
    	if (chat.userId.toString() !== user._id.toString()) {
      		return NextResponse.json({ message: 'Нет доступа к этому чату' }, { status: 403 });
    	}
	
	console.log('newMessages:', newMessages);
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: { $each: newMessages } } },
	  { new: true }
    );

	console.log(updatedChat)

    return NextResponse.json(updatedChat, { status: 200 });
  } catch (error) {
    console.error('[PATCH /api/chats/[chatId]]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};


export async function DELETE(req: NextRequest, context: {params: Promise<{ chatId: string}>}) {
	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

	await connectToDB();

  	const user = await User.findOne({ email: session.user?.email });
  	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	const params = await context.params;
	const chatId = params.chatId;

	const chat = await Chat.findById(chatId);
	if (!chat) return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });

	if (chat.userId.toString() !== session.user?.id) {
    	return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });
  	}

	await Chat.findByIdAndDelete(chatId);

 	return NextResponse.json({ message: 'Чат удален' }, { status: 200 });
};