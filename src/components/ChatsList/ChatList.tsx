import { FC } from "react";
import Link from 'next/link';
import { IChat } from "@/types";
import styles from './ChatList.module.scss';
import { RiDeleteBinLine } from "react-icons/ri";
import { useRouter } from "next/navigation";



interface ChatsListProps {
	chats: IChat[]
};

 
const ChatsList: FC<ChatsListProps> = ({ chats }) => {


	const router = useRouter();

	const deleteChat = async (id: string) => {
		
		const res = await fetch(`/api/chats/${id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			router.push('/chat')
		}
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
						Chat {new Date(chat.createdAt).toLocaleString()}
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