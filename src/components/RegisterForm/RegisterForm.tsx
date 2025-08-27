'use client'

import { useState } from 'react';
import styles from './RegisterForm.module.scss'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';



const RegisterFrom = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [, setError] = useState('');
	const router = useRouter();


	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ email, password}),
		});

		const data = await res.json();
		if (!res.ok) {
			setError(data.error || 'Error registration');
			return;
		}

		const signInRes = await signIn('credentials', {redirect: false, email, password} );

		if (signInRes && (signInRes as any).error) {
			setError((signInRes as any).error);
			return;
		};

		router.push('/chat');
	};


	return (
		<form
			className={styles.form}
			onSubmit={handleRegister}
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
 
export default RegisterFrom;