'use client'

import SideBar from "@/components/SideBar/SideBar";
import styles from './chat.module.scss';
import Aurora from "@/components/Aurora/Aurora";
import ChatInput from "@/components/ChatInput/ChatInput";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const Chat = () => {

  	const { data: session, status } = useSession();
  	const router = useRouter();
  	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated") {
		router.replace("/login");
		} else if (status === "authenticated") {
		setReady(true);
		}
	}, [status, router]);

	if (!ready) return null;

	return (
		<div className={styles.chatPage}>
      		<SideBar/>
			<Aurora/>
			<div className={styles.inputWrapper}>
				<p className={styles.title}>What can I help with?</p>
				<ChatInput/>
			</div>
		</div>
	);
}
 
export default Chat;