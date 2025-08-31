"use client";


import styles from './Input.module.scss';
import { KeyboardEvent, useEffect, useRef } from 'react';
import MyInputButton from '@/UI/MyInputButton/MyInputButton';



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
	
	const textareaRef = useRef<HTMLTextAreaElement>(null);
  	const prevValueRef = useRef(props.value);

	useEffect(() => {
		if (prevValueRef.current !== props.value && textareaRef.current && props.mode === 'chatid') {
		const textarea = textareaRef.current;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
		prevValueRef.current = props.value;
		}
	}, [props.value, props.mode]);

	return (
		<div className={`${styles.inputArea} ${props.mode === 'chat' ? styles.inputGlass : ''}`}>
			<textarea
				ref={textareaRef}
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