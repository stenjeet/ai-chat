'use client'

import MyInputButton from "@/UI/MyInputButton/MyInputButton";
import ShinyText from "../ShinyText/ShinyText";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from './VisualInput.module.scss';

 

const VisualInput = () => {

	const router = useRouter();
	const {data: session} = useSession();

	return (
		<div className={styles.visualInput}>
			<ShinyText text="Give me a startup idea in 1 minute" speed={5}/>
			<MyInputButton
				btnHandler={(() => session?.user ? router.push('/chat') : router.push('/login'))}/>
		</div>
	);
}
 
export default VisualInput;