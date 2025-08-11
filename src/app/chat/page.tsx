import SideBar from "@/components/SideBar/SideBar";
import styles from './chat.module.scss';



const Chat = () => {
	return (
		<div className={styles.chatPage}>
      		<SideBar/>
		</div>
	);
}
 
export default Chat;