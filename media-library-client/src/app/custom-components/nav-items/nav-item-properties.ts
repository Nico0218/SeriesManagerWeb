import { CSSProperties } from 'react';

export default interface NavItemProperties {
	href: string;
	title: string;
	style?: CSSProperties;
	onClick?: () => void;
	children?: React.ReactNode;
}
