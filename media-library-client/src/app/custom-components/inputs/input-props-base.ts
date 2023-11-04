import { SxProps, Theme } from '@mui/material';
import IInputValidationProps from './input-validation-props';

export default interface ImportPropsBase<T> extends IInputValidationProps<T> {
	id: string;
	label: string;
	value?: T;
	onChange?: (value: T) => void;
	placeHolder?: T;
	sx?: SxProps<Theme>;
	isReadOnly?: boolean;
	helperText?: string;
	onEnterPress?: () => void;
}
