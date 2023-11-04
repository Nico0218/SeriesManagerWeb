import { TextFieldPropsSizeOverrides } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import ImportPropsBase from '../input-props-base';

export default interface ValidatedTextProps extends ImportPropsBase<string> {
	minLength?: number;
	maxLength?: number;
	multiline?: boolean;
	rows?: number;
	maxRows?: number;
	size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>;
}
