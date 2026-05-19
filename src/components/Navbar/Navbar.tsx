'use client'

import { useRouter } from 'next/navigation';
import styles from './Navbar.module.scss';
import { signOut, useSession } from 'next-auth/react';


 
const NavBar = () => {

	const { data: session } = useSession();
	const router = useRouter();

	return (
		<div className={styles.navbar}>
			<p className={styles.title}>chatai</p>
			<div className={styles.authBtns}>

				{!session?.user 
				?
					<button
						className={styles.authBtn}
						onClick={() => router.push('/register')}
					>
						Sing up
					</button>
				:
					<button
						className={styles.authBtn}
						onClick={() => signOut({ callbackUrl: '/'})}
					>
						Log out
					</button>
				}

				{!session?.user 
				?	
					<button 
						className={styles.authBtn}
						onClick={() => router.push('/login')}
					>
						Log in
					</button>
				:
					<button 
						className={styles.authBtn}
						onClick={() => router.push('/chat')}
					>
						Chat
					</button>
				}
			</div>
		</div>
	);
}
 
export default NavBar;