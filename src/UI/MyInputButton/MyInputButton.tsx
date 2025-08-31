import { MdOutlineArrowUpward } from 'react-icons/md';
import styles from './MyInputButton.module.scss';
import { FC } from 'react';



interface MyInputButtonProps {
	btnHandler: () => void,
	disabled?: boolean,
}


const MyInputButton: FC<MyInputButtonProps> = ({ btnHandler, disabled}) => {
	return (
	    <button 
			className={styles.btn}
			onClick={btnHandler}
			disabled={disabled}
			>
    		<MdOutlineArrowUpward color="#000" size={18} />
    	</button>
	);
}
 
export default MyInputButton;