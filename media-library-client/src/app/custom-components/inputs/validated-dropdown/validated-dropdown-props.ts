import { SxProps, Theme } from '@mui/material';
import ImportPropsBase from '../input-props-base';
import DropDownItem from './drop-down-item';

export default interface ValidatedDropdownProps
	extends ImportPropsBase<string | number | readonly string[] | undefined> {
	values: DropDownItem[];
	innerSelectSx?: SxProps<Theme>;
}
