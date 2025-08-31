import RegisterForm from "@/components/RegisterForm/RegisterForm";
import styles from './page.module.scss';
import Aurora from "@/components/Aurora/Aurora";



const Register = () => {
	return (
		<div className={styles.registerPage}>
			<Aurora/>
			<div className={styles.content}>
				<p className={styles.title}>Create an account</p>
				<RegisterForm/>
			</div>
		</div>
	);
}
 
export default Register;