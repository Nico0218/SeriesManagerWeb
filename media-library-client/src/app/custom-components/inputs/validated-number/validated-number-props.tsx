import { TextFieldPropsSizeOverrides } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import ImportPropsBase from '../input-props-base';

export interface ValidatedNumberProps extends ImportPropsBase<number> {
	minValue?: number;
	maxValue?: number;
	size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>;
}
