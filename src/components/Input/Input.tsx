"use client";


import styles from './Input.module.scss';
import { KeyboardEvent } from 'react';
import MyInputButton from '@/UI/MyInputButton/MyInputButton';
import TextareaAutosize  from 'react-textarea-autosize';



interface BaseProps {
	btnHandler: () => void,
	disabled?: boolean,
};

interface EditableProps extends BaseProps {
	mode: 'chat' | 'chatid',
	placeholder: string,
	value: string,
	onChange: (value: string) => void,
	onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

type InputProps = EditableProps;

 
const Input= (props: InputProps) => {
	
	return (
		<div className={`${styles.inputArea} ${props.mode === 'chat' ? styles.inputGlass : ''}`}>
			<TextareaAutosize
    	  		className={`${styles.input} ${props.mode === 'chat' ? styles.inputMainPage : ''}`}
    	  		placeholder={props.placeholder}
    	  		value={props.value}
    	  		onChange={(e) => props.onChange(e.target.value)}
				onKeyDown={props.onKeyDown}
			/>
			<MyInputButton btnHandler={props.btnHandler} disabled={props.disabled}/>
    	</div>
	);
}
 
export default Input;