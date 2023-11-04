import { SxProps, TextField, Theme } from '@mui/material';
import { useEffect, useState, KeyboardEvent } from 'react';
import FormValidator from '../form-validator';
import { ValidatedNumberProps } from './validated-number-props';

export default function ValidatedNumber({
	id,
	label,
	value,
	isReadOnly,
	onChange,
	helperText,
	isRequired,
	minValue,
	maxValue,
	customValidation,
	sx,
	placeHolder,
	onEnterPress,
	formID,
	formState,
	setFormState,
	size,
}: ValidatedNumberProps) {
	const [valid, setValid] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	function validate(value?: number) {
		if (isRequired && !value) {
			setValid(false);
			setErrorMessage('Required');
			return;
		}
		if (value === undefined) {
			setValid(false);
			setErrorMessage(`${label} can not be empty.`);
			return;
		}
		if (minValue !== undefined && value < minValue) {
			setValid(false);
			setErrorMessage(`${label} can not be less than ${minValue}.`);
			return;
		}
		if (maxValue !== undefined && value > maxValue) {
			setValid(false);
			setErrorMessage(`${label} can not be more than ${maxValue}.`);
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

	const renderInput = () => {
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
				InputProps={{ inputMode: 'numeric', readOnly: isReadOnly ?? false }}
				error={!valid}
				helperText={getErrorMessage()}
				onBlur={e => {
					validate(Number.parseInt(e.target.value));
				}}
				onKeyUp={e => {
					e.preventDefault();
					enterKeyEvent(e);
				}}
				onChange={e => {
					if (onChange) {
						let parsedValue = Number.parseInt(e.target.value);
						if (Number.isNaN(parsedValue)) {
							parsedValue = 0;
						}
						if (parsedValue === 0 || Number.isInteger(parsedValue)) {
							onChange(parsedValue);
						}
					}
				}}
				size={size}
				placeholder={placeHolder?.toString() ?? '0'}
				InputLabelProps={{ shrink: true }}
			/>
		);
	};

	return renderInput();
}
