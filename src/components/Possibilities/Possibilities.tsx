import styles from './Possibilities.module.css'
import { IoCodeSlash } from "react-icons/io5";
import { MdOutlineTranslate } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { MdOutlineTopic } from "react-icons/md";
import { IoTextOutline } from "react-icons/io5";
import { GiBrain } from "react-icons/gi";


const Possibilities = () => {

	const possibilities = [
	{
		icon: <IoCodeSlash size={22}/>,
		title: 'Assistance with programming',
		text: 'Code generation, debugging, and explanation of algorithms in various programming languages'
	},
	{
		icon: <TfiWrite size={22}/>,
		title: 'Creative writing',
		text: 'Writing poetry, scripts, essays, and creative texts in any genre'
	},
	{
		icon: <MdOutlineTopic size={22}/>,
		title: 'Explaining difficult topics',
		text: 'Get simple and clear explanations on any topic, from science to art.'
	},
	{
		icon: <MdOutlineTranslate size={22}/>,
		title: 'Translation of languages',
		text: 'Instant and accurate translation of texts between many languages'
	},
	{
		icon: <IoTextOutline size={22}/>,
		title: 'Summarization of texts',
		text: 'Get a summary of the length of articles, documents, and books'
	},
	{
		icon: <GiBrain size={22}/>,
		title: 'Brainstorming',
		text: 'Generate new ideas for projects, business, or personal development'
	},
]

	return (
		<div className={styles.possibilities}>
			{possibilities.map((item, index) => (
				<div key={index} className={styles.item}>
					{item.icon}
					<p className={styles.possibilitiesTitle}>{item.title}</p>
					<p className={styles.text}>{item.text}</p>
				</div>
			))}
		</div>
	)
};

export default Possibilities;