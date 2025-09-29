'use client'

import { FC } from 'react';
import styles from './Plans.module.scss'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation';



interface PlansProps {
	title: string,
	subtitle: string,
	list: string[],
	price: number,
	buttonText: string,
}

const Plans: FC<PlansProps> = ({ title, subtitle, buttonText, list, price}) => {

	const router = useRouter();


	return (
		<div className={styles.plans}>
			<p className={styles.title}>{title}</p>
			<p className={styles.subtitle}>{subtitle}</p>
			<ul className={styles.list}>
				{list.map((item, index) => (
					<li
						key={index}
						className={styles.item}
					>
						<Check size={20}/>
						{item}
					</li>
				))}
			</ul>
			<div className={styles.priceWrapper}>
				<p className={styles.price}>{price}$ / month</p>
				<button
					className={styles.PlanBtn}
					onClick={() => router.push('/chat')}
				>
					{buttonText}
				</button>
			</div>
		</div>
	)
}

export default Plans;