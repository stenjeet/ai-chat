'use client'

import { useEffect, useRef, useState } from "react";
import styles from './ChatWindow.module.scss';
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import Input from "../Input/Input";
import ShinyText from "../ShinyText/ShinyText";



interface Message {
  role: 'user' | 'assistant';
  text: string;
};

const ChatWindow = () => {
	const [messages, setMessages] = useState<Message[]>([]);
  	const [input, setInput] = useState('');
  	const [loading, setLoading] = useState(false);

  	const params = useParams();
  	const chatId = params?.chatId;


	const sendMessage = async () => {
		if (!input.trim() || !chatId) return;

		const userMessage: Message = { role: 'user', text: input };

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			const res = await fetch('/api/message', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: input }),
			});

			const data = await res.json();
			const aiResponse = data?.result?.alternatives?.[0]?.message?.text ?? 'Нет ответа';

			const assistantMessage: Message = {
				role: 'assistant',
				text: aiResponse,
			};
			setMessages(prev => [...prev, assistantMessage]);


			const patchRes = await fetch(`/api/chats/${chatId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				newMessages: [
					userMessage,
					assistantMessage,
				],
			}),
			});

			const updatedChat = await patchRes.json();
			if (updatedChat.messages) {
				setMessages(updatedChat.messages);
			}

		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		};
	};


 	const handleKeyDown = (e: React.KeyboardEvent) => {
    	if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
      		sendMessage();
    	};
  	};


  	useEffect(() => {
    	if (!chatId) return;

		async function fetchChat() {
		const res = await fetch(`/api/chats/${chatId}`);
		const data = await res.json();
		setMessages(Array.isArray(data.messages) ? data.messages : []);
		}

    	fetchChat();
  	}, [chatId]);


	const lastUserMessageRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messages.length === 0) return;

		const lastMessage = messages[messages.length - 1];
		
		if (lastMessage.role === 'assistant' && lastUserMessageRef.current) {
			lastUserMessageRef.current.scrollIntoView({ behavior: "smooth", block: 'start', inline: 'nearest'});
		}
	}, [messages])


	return (
 		<div className={styles.container} >
			<div className={styles.chatWindow}>
				{(messages ?? []).length > 0 ? (
					messages.map((msg, idx) => {
						const isLastUserMessage = msg.role === 'user' && (idx === messages.length - 1 || messages[idx + 1].role === 'assistant');
						
						return (
							<div
								key={idx}
								className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}
								ref={isLastUserMessage ? lastUserMessageRef : null}
							>
								{msg.role === 'assistant' ? (
									<ReactMarkdown>{msg.text}</ReactMarkdown>
								) : (msg.text)}
							</div>
						)
					})
				) : (
					<div className={styles.emptyChat}>
						<ShinyText text="No messages yet"/>
					</div>
				)}
			</div>
			<Input
				mode="chatid"
				placeholder="Ask anything"
				value={input}
				onChange={setInput}
				onKeyDown={handleKeyDown}
				btnHandler={sendMessage}
				disabled={loading}
			/>
    	</div>
	);
};
 
export default ChatWindow;
