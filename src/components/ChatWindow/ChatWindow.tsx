'use client'

import { useEffect, useRef, useState } from "react";
import styles from './ChatWindow.module.scss';
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import Input from "../Input/Input";
import ShinyText from "../ShinyText/ShinyText";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence} from "framer-motion";



interface Message {
  role: 'user' | 'system';
  content: string;
};

const ChatWindow = () => {
	const [messages, setMessages] = useState<Message[]>([]);
  	const [input, setInput] = useState('');
  	const [loading, setLoading] = useState(false);

  	const params = useParams();
  	const chatId = params?.chatId;


	const sendMessage = async () => {
		if (!input.trim() || !chatId) return;

		const userMessage: Message = { role: 'user', content: input };

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
			const aiResponse = data?.choices?.[0]?.message?.content ?? 'Нет ответа';


			const assistantMessage: Message = {
				role: 'system',
				content: aiResponse,
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
		
		if (lastMessage.role === 'system' && lastUserMessageRef.current) {
			lastUserMessageRef.current.scrollIntoView({ behavior: "smooth", block: 'start', inline: 'nearest'});
		}
	}, [messages])


	return (
 		<div className={styles.container} >
			<div className={styles.chatWindow}>
				<AnimatePresence initial={false}>
  					{(messages ?? []).map((msg, idx) => {
    					const isLastUserMessage = msg.role === 'user' && (idx === messages.length - 1 || messages[idx + 1].role === 'system');

    					return (
      						<motion.div
      						  	key={idx}
      						  	className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}
      						  	ref={isLastUserMessage ? lastUserMessageRef : null}
      						  	initial={{ opacity: 0, y: -10 }}
      						  	animate={{ opacity: 1, y: 0 }}
      						  	exit={{ opacity: 0, y: -10 }}
      						  	transition={{ duration: 0.3 }}
      						  	layout
      						>
        						{msg.role === 'system' ? (
          							<div className={styles.markdown}>
    									<ReactMarkdown remarkPlugins={[remarkGfm]}>
      										{msg.content}
    									</ReactMarkdown>
  									</div>
        						) : (
          							msg.content
        						)}
      						</motion.div>
    					);
  					})
					};

  					{loading && (
  						<motion.div
  					    	key="loading"
  					    	className={`${styles.message} ${styles.assistant} ${styles.loading}`}
  					    	initial={{ opacity: 0, y: -10 }}
  					    	animate={{ opacity: 1, y: 0 }}
  					    	exit={{ opacity: 0, y: -10 }}
  					    	transition={{ duration: 0.3 }}
  					    	layout
  					  	>
  					    	AI печатает<span className={styles.dots}>...</span>
  					  	</motion.div>
  					)}
				</AnimatePresence>
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
