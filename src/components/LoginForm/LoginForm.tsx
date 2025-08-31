'use client'

import { useState } from 'react';
import styles from './LoginForm.module.scss';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';



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
			setError('Incorrect email or password');
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
			{error && <p className={styles.error}>{error}</p>}
			<button
				type='submit'
				className={styles.registerBtn}
			>
				Continue
			</button>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<Link style={{fontSize: 14, textDecoration: 'underline'}} href={'/register'}>Sing up</Link>
				<Link style={{fontSize: 14, textDecoration: 'underline'}} href={'/'}>Back</Link>
			</div>
		</form>
	);
}
 
export default LoginForm;
