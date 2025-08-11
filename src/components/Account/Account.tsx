import { CiLogout } from 'react-icons/ci';
import styles from './Account.module.scss';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";



type AccountProps = {
  session: ReturnType<typeof useSession>['data'] | null | undefined;
};


const Account = ({ session }: AccountProps) => {

	if (!session) return (
		<div>

		</div>
	);

	return (
		<div className={styles.account}>
			<p>
				{session.user?.email}
			</p>
			<CiLogout className={styles.logout} onClick={() => signOut({ callbackUrl: "/" })}/>
		</div>
	);
}
 
export default Account;