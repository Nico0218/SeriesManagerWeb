import {
	FormControl,
	FormHelperText,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
	SxProps,
	Theme,
} from '@mui/material';
import { KeyboardEvent, useEffect, useState } from 'react';
import FormValidator from '../form-validator';
import ValidatedDropdownProps from './validated-dropdown-props';

export default function ValidatedDropdown({
	id,
	label,
	value,
	isReadOnly,
	onChange,
	helperText,
	isRequired,
	customValidation,
	sx,
	placeHolder,
	onEnterPress,
	formID,
	formState,
	setFormState,
	values,
	innerSelectSx,
}: ValidatedDropdownProps) {
	const generateDropDownItems = () => {
		const dropDownItems: JSX.Element[] = [];
		for (const dropDownItem of values) {
			if (dropDownItem.isSubheader) {
				dropDownItems.push(
					<ListSubheader
						id={`${id}-${dropDownItem.label?.replaceAll(' ', '') ?? ''}`}
						key={`${id}-${dropDownItem.label?.replaceAll(' ', '') ?? ''}`}
						value={dropDownItem.value}
					>
						{dropDownItem.label}
					</ListSubheader>
				);
			} else {
				dropDownItems.push(
					<MenuItem
						id={`${id}-${dropDownItem.label?.replaceAll(' ', '') ?? ''}`}
						key={`${id}-${dropDownItem.label?.replaceAll(' ', '') ?? ''}`}
						value={dropDownItem.value}
					>
						{dropDownItem.label}
					</MenuItem>
				);
			}
		}
		return dropDownItems;
	};

	const [valid, setValid] = useState(true);

	const validate = (value: string | number | readonly string[] | undefined) => {
		if (
			(typeof value !== 'number' && !value && isRequired) ||
			(typeof value === 'number' && value < 0)
		) {
			setValid(false);
			return;
		}
		setValid(true);
	};

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
	}, [valid]);

	useEffect(() => {
		if (valid && formID && formState?.IsFormDirty(formID)) {
			validate(value);
		}
	}, [formState]);

	const [valueState, setValueState] = useState(value);

	useEffect(() => {
		validate(valueState);
		if (onChange && valueState !== undefined) {
			onChange(valueState);
		}
	}, [valueState]);

	const enterKeyEvent = (onKeyUp: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (onEnterPress && onKeyUp.key === 'Enter') {
			onEnterPress();
		}
	};

	const defaultStyle: SxProps<Theme> = { width: '100%', padding: 1 };

	const renderInput = () => {
		return (
			<FormControl sx={sx ? { ...defaultStyle, ...sx } : defaultStyle} disabled={isReadOnly}>
				<InputLabel id={`${id}-dropdown-label`}>{isRequired ? label + ' *' : label}</InputLabel>
				<Select
					labelId={`${id}-dropdown-label`}
					id={`${label}-dropdown-select`}
					value={valueState}
					label={label}
					disabled={isReadOnly}
					onChange={e => {
						setValueState(e.target.value);
					}}
					error={!valid}
					required={isRequired}
					key={`${label}-dropdown-select`}
					sx={{ width: '100%', ...innerSelectSx }}
					multiple={Array.isArray(valueState)}
					onKeyUp={e => {
						e.preventDefault();
						enterKeyEvent(e);
					}}
				>
					{generateDropDownItems()}
				</Select>
				{!valid && <FormHelperText>Please select a value.</FormHelperText>}
			</FormControl>
		);
	};

	return renderInput();
}
