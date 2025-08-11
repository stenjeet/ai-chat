import RegisterForm from "@/components/RegisterForm/RegisterForm";
import styles from './page.module.scss';



const Register = () => {
	return (
		<div className={styles.registerPage}>
			<div className={styles.content}>
				<p className={styles.title}>Create an account</p>
				<RegisterForm/>
			</div>
		</div>
	);
}
 
export default Register;