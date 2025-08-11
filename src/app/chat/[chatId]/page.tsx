import ChatWindow from "@/components/ChatWindow/ChatWindow";
import SideBar from "@/components/SideBar/SideBar";
import styles from './chat.module.scss';



const Chat = () => {
	return (
		<div className={styles.chatPage}>
      		<SideBar/>
	  		<ChatWindow/>
		</div>
	);
}
 
export default Chat;