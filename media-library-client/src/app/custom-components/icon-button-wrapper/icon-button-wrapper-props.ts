import { SxProps, Theme } from '@mui/material/styles';
import IconSelector from '../icon-loader/icon-selector';

export default interface IconButtonWrapperProps {
	id: string;
	label?: string;
	ariaLabel?: string;
	icon: IconSelector;
	onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
	size?: 'small' | 'medium' | 'large' | undefined;
	sx?: SxProps<Theme> | undefined;
	badgeIcon?: boolean;
}
