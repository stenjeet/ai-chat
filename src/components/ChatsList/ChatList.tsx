'use client'

import { FC } from "react";
import Link from 'next/link';
import { IChat } from "@/types";
import styles from './ChatList.module.scss';
import { RiDeleteBinLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";



interface ChatsListProps {
	chats: IChat[]
	setChats: React.Dispatch<React.SetStateAction<IChat[]>>
};

 
const ChatsList: FC<ChatsListProps> = ({ chats, setChats }) => {


	const router = useRouter();
	const pathname = usePathname();

	const deleteChat = async (id: string) => {
		
		const res = await fetch(`/api/chats/${id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			setChats((prevChats: IChat[]) => prevChats.filter(chat => chat._id.toString() !== id))
			
			
			if (pathname.startsWith(`/chat/${id}`)) {
      			router.push('/chat');
    		};
		};
	};

	return (
		<ul className={styles.ul}>
			{chats.map((chat) => (
				<li 
					key={chat._id.toString()} 
					className={styles.li}
				>
					<Link
						href={`/chat/${chat._id}`}
					>
						Chat {new Date(chat.createdAt).toLocaleDateString()}
					</Link>
					<RiDeleteBinLine
						className={styles.deleteBtn}
						onClick={() => deleteChat(chat._id.toString())}
					/>
				</li>
			))}
		</ul>
	);
}
 
export default ChatsList;