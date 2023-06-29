import { CSSProperties } from 'react';

export default interface NavItemProperties {
	href: string;
	title: string;
	small?: boolean;
	noIcon?: boolean;
	color?: string;
	style?: CSSProperties;
	onClick?: () => void;
	children?: React.ReactNode;
}
