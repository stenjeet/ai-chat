'use client'

import styles from './SideBar.module.scss';
import { useEffect, useState } from "react";
import { House, PanelLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ChatsList from '../ChatsList/ChatList';
import Account from '../Account/Account';
import { IChat } from '@/types';



const SideBar = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [chats, setChats] = useState<IChat[]>([]);

	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!session?.user) return;

		async function fetchChats() {
			const res = await fetch('/api/chats');
			const data = await res.json();
			setChats(data);
		};

		fetchChats();
	}, [session?.user]);


	const createChat = async () => {
		const res = await fetch('/api/chats', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: [] }),
		});

		const chat = await res.json();

		setChats(prev => [chat, ...prev]);

		router.push(`/chat/${chat._id}`);
	};


	function onToggle() {
		setCollapsed(prev => !prev);
	};

	return (
		<div className={`${styles.sidebar} ${collapsed && styles.collapsed}`}>
			<div>
				<div className={styles.sidebarBtns}>
					<House className={styles.icon} onClick={() => router.push('/')} />
					<PanelLeft className={styles.icon} onClick={onToggle} />
				</div>

				<button className={styles.btn} onClick={createChat}>
					New chat
				</button>
				<p className={styles.title}>Chats</p>
				<ChatsList chats={chats}/>
			</div>
			<div className={styles.account}>
				<Account session={session}/>
			</div>
		</div>
	);
}

export default SideBar;