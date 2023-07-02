import { breadCrumbKey } from '../constants';
import BreadCrumbItem from '../private-container/main-app-bar/bread-crumb/bread-crumb-item';
import { getLocalStorageItem, setLocalStorageItem } from './local-storage';

export function AddBreadCrumbItem(breadCrumbItem: BreadCrumbItem) {
	let breadCrumbItems = getLocalStorageItem<BreadCrumbItem[]>(breadCrumbKey);
	if (!breadCrumbItems) breadCrumbItems = [];
	if (!breadCrumbItems.find(x => x.route === breadCrumbItem.route)) {
		breadCrumbItems.push(breadCrumbItem);
	}
	setLocalStorageItem(breadCrumbKey, breadCrumbItems);
}

export function RemoveBreadCrumbItem(breadCrumbItem: BreadCrumbItem) {
	const breadCrumbItems = getLocalStorageItem<BreadCrumbItem[]>(breadCrumbKey);
	if (!breadCrumbItems) return;
	const existingItemIndex = breadCrumbItems.findIndex(x => x.route === breadCrumbItem.route);
	if (existingItemIndex >= 0 && breadCrumbItems.length > existingItemIndex + 1) {
		breadCrumbItems.splice(existingItemIndex + 1, 1);
		setLocalStorageItem(breadCrumbKey, breadCrumbItems);
	}
}
