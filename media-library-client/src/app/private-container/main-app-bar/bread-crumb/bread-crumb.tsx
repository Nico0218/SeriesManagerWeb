import { useEffect, useMemo, useState } from 'react';
import { breadCrumbKey } from '../../../constants';
import NavItem from '../../../custom-components/nav-items/nav-item';
import { RemoveBreadCrumbItem } from '../../../functions/bread-crumb-functions';
import {
	addLocalStorageEventListener,
	getLocalStorageItem,
} from '../../../functions/local-storage';
import BreadCrumbItem from './bread-crumb-item';

export default function BreadCrumb() {
	const [breadCrumbItems, setBreadCrumbItems] = useState<BreadCrumbItem[]>([]);
	useEffect(() => {
		addLocalStorageEventListener(breadCrumbKey, () => {
			const breadCrumbItems = getLocalStorageItem<BreadCrumbItem[]>(breadCrumbKey);
			if (breadCrumbItems) {
				setBreadCrumbItems(breadCrumbItems);
			}
		});
	}, []);

	const renderBreadCrumb = useMemo(() => {
		const breadCrumbControls: JSX.Element[] = [];
		for (let i = 0; i < breadCrumbItems.length; i++) {
			const breadCrumbItem = breadCrumbItems[i];
			breadCrumbControls.push(
				<NavItem
					key={breadCrumbItem.route}
					href={breadCrumbItem.route}
					title={breadCrumbItem.label}
					onClick={() => {
						RemoveBreadCrumbItem(breadCrumbItem);
					}}
				/>
			);
		}
		return breadCrumbControls;
	}, [breadCrumbItems]);

	return renderBreadCrumb;
}
