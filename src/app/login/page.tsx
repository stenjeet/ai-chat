import LoginForm from "@/components/LoginForm/LoginForm";
import styles from './page.module.scss';
 


const Login = () => {
	return (
		<div className={styles.loginPage}>
			<div className={styles.content}>
				<p className={styles.title}>Welcome back</p>
				<LoginForm/>
			</div>
		</div>
	);
}
 
export default Login;