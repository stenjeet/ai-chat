'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../Input/Input';



interface Message {
  role: 'user' | 'assistant';
  text: string;
};

const ChatInput = () => {
	const [input, setInput] = useState('');
	const router = useRouter();

	const sendMessage = async () => {
		if (!input.trim()) return;

		try {
		const createChatRes = await fetch('/api/chats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: [] }),
		});
		const chat = await createChatRes.json();
		const chatId = chat._id;

		const userMessage: Message = { role: 'user', text: input };


		const resAI = await fetch('/api/message', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: input }),
		});
		const data = await resAI.json();
		const aiResponse = data?.result?.alternatives?.[0]?.message?.text ?? 'Нет ответа';
		const assistantMessage: Message = { role: 'assistant', text: aiResponse };


		await fetch(`/api/chats/${chatId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			newMessages: [userMessage, assistantMessage],
			}),
		});


		router.push(`/chat/${chatId}`);
		} catch (error) {
		console.error(error);
		}
  	};

   	const handleKeyDown = (e: React.KeyboardEvent) => {
    	if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
      		sendMessage();
    	};
  	};

  return (
	<Input
		placeholder="Ask anything"
		value={input}
		onChange={setInput}
		btnHandler={sendMessage}
		onKeyDown={handleKeyDown}
		mode='chat'
	/>
  );
};

export default ChatInput;
