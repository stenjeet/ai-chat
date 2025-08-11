'use client'

import { useRouter } from 'next/navigation';
import styles from './Navbar.module.scss';


 
const NavBar = () => {
	const router = useRouter();

	return (
		<div className={styles.navbar}>
			<p className={styles.title}>chatai</p>
			<div className={styles.authBtns}>
				<button
					className={styles.authBtn}
					onClick={() => router.push('/register')}
				>
					Sing up
				</button>
				<button 
					className={styles.authBtn}
					onClick={() => router.push('/login')}
				>
					Log in
				</button>
			</div>
		</div>
	);
}
 
export default NavBar;