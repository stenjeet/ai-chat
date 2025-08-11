'use client'

import { useState } from 'react';
import styles from './LoginForm.module.scss';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';



const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');			
	const router = useRouter();


	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		const res = await signIn('credentials', {redirect: false, email, password});
		if (res?.error) {
			setError(res.error);
			return;
		};

		router.push('/chat');
	};


	return (
		<form
			className={styles.form}
			onSubmit={handleLogin}
		>
			<div className={styles.inputGroup}>
				<input
					className={styles.input}
					id='email'
					type="email"
					placeholder=" "
					onChange={e => setEmail(e.target.value)}
				/>
				<label className={styles.label} htmlFor="email">Email</label>
			</div>
			<div className={styles.inputGroup}>
				<input 
					className={styles.input}
					id='password'
					type="password" 
					placeholder=" "
					onChange={e => setPassword(e.target.value)}
				/>
				<label className={styles.label} htmlFor="password">Password</label>
			</div>
			<button
				type='submit'
				className={styles.registerBtn}
			>
				Continue
			</button>
		</form>
	);
}
 
export default LoginForm;
