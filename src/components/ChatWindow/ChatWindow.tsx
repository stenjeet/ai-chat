'use client'

import { useEffect, useState } from "react";
import styles from './ChatWindow.module.scss';
import { MdOutlineArrowUpward } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';



interface Message {
  role: 'user' | 'assistant';
  text: string;
};

const ChatWindow = () => {
	const [messages, setMessages] = useState<Message[]>([]);
  	const [input, setInput] = useState('');
  	const [loading, setLoading] = useState(false);


	const { data: session } = useSession();
  	const userId = session?.user?.id;
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
    	if (e.key === 'Enter') {
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


	return (
 		<div className={styles.container} >
			<div className={styles.chatWindow}>
				{(messages ?? []).length > 0 ? (
					messages.map((msg, idx) => (
					<div
						key={idx}
						className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}
					>
						{msg.role === 'assistant' ? (
							<ReactMarkdown>{msg.text}</ReactMarkdown>
						) : (msg.text)}
					</div>
					))
				) : (
					<div className={styles.emptyChat}>Нет сообщений</div>
				)}
			</div>

			<div className={styles.inputArea}>
				<textarea
				className={styles.input}
				placeholder="сообщение"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				/>
				
				<button
				className={styles.sendButton}
				onClick={sendMessage}
				disabled={loading}
				>
					<MdOutlineArrowUpward color="#000" size={18}/>
				</button>
			</div>
    	</div>
	);
};
 
export default ChatWindow;
