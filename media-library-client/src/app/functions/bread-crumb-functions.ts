import { breadcrumbLinkStorageID } from '../constants';
import BreadcrumbItem from '../private-container/main-app-bar/breadcrumb/breadcrumb-item';

export const updateBreadcrumbLinks = (breadcrumbLinks: BreadcrumbItem[]) => {
	window.localStorage.setItem(breadcrumbLinkStorageID, JSON.stringify(breadcrumbLinks));
	window.dispatchEvent(new Event(`${breadcrumbLinkStorageID}-event`));
};

export const getBreadcrumbLinks = () => {
	const breadcrumbLinks = window.localStorage.getItem(breadcrumbLinkStorageID);
	if (breadcrumbLinks === null) return [];
	return JSON.parse(breadcrumbLinks) as BreadcrumbItem[];
};
