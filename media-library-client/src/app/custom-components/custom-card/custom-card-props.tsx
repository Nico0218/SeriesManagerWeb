import { ReactNode } from 'react';

export default interface CustomCardProps {
	imgSrc?: string;
	title?: string;
	description?: string;
	defaultAction?: () => void;
	children?: ReactNode;
}
