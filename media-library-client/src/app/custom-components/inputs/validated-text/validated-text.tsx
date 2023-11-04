import { SxProps, Theme } from '@mui/material';
import TextField from '@mui/material/TextField';
import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import FormValidator from '../form-validator';
import ValidatedTextProps from './validated-text-props';

export default function ValidatedTextField({
	id,
	label,
	value,
	isReadOnly,
	onChange,
	helperText,
	isRequired,
	minLength,
	maxLength,
	customValidation,
	maxRows,
	multiline,
	rows,
	sx,
	placeHolder,
	onEnterPress,
	formID,
	formState,
	setFormState,
	size,
}: ValidatedTextProps) {
	const [valid, setValid] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	function validate(value?: string) {
		if (isRequired && !value) {
			setValid(false);
			setErrorMessage('Required');
			return;
		}
		if (minLength && (!value || value.length < minLength)) {
			setValid(false);
			setErrorMessage(`${label} must be at least ${minLength} characters long.`);
			return;
		}
		if (maxLength && value && value.length > maxLength) {
			setValid(false);
			setErrorMessage(`${label} can not be longer than ${maxLength} characters.`);
			return;
		}
		if (customValidation) {
			const result = customValidation(value);
			if (!result.valid) {
				setValid(result.valid);
				setErrorMessage(result.message);
				return;
			}
		}
		setValid(true);
		setErrorMessage('');
	}

	useEffect(() => {
		if (valid && formID && formState?.IsFormDirty(formID)) {
			validate(value);
		}
	}, [formState]);

	useEffect(() => {
		if (setFormState) {
			setFormState(prevState => {
				const temp = new FormValidator(prevState.forms);
				if (formID) {
					temp.SetInputState(formID, id, valid);
				}
				return temp;
			});
		}
	}, [valid, setValid]);

	const getErrorMessage = () => {
		if (valid) {
			return helperText;
		}
		return errorMessage;
	};

	const enterKeyEvent = (onKeyUp: KeyboardEvent<HTMLDivElement>) => {
		if (onEnterPress && onKeyUp.key === 'Enter') {
			onEnterPress();
		}
	};

	const defaultStyle: SxProps<Theme> = { width: '100%', padding: 1 };

	const renderInput = useMemo(() => {
		return (
			<TextField
				key={id}
				id={id}
				label={label}
				variant="outlined"
				value={value}
				sx={sx ? { ...defaultStyle, ...sx } : defaultStyle}
				required={isRequired}
				disabled={isReadOnly ?? false}
				InputProps={{ readOnly: isReadOnly ?? false }}
				error={!valid}
				helperText={getErrorMessage()}
				onBlur={e => {
					validate(e.target.value);
				}}
				onChange={e => {
					if (onChange) {
						onChange(e.target.value);
					}
				}}
				onKeyUp={e => {
					e.preventDefault();
					enterKeyEvent(e);
				}}
				multiline={multiline ?? false}
				minRows={rows}
				maxRows={maxRows}
				size={size}
				placeholder={placeHolder}
				InputLabelProps={{ shrink: !!value }}
			/>
		);
	}, [value, valid]);

	return renderInput;
}
