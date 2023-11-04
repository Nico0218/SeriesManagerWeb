import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { breadcrumbLinkStorageID } from '../../../constants';
import NavItem from '../../../custom-components/nav-items/nav-item';
import { getBreadcrumbLinks } from '../../../functions/bread-crumb-functions';
import { addLocalStorageEventListener } from '../../../functions/local-storage';
import BreadcrumbItem from './breadcrumb-item';

export default function BreadCrumb() {
	const [breadcrumbLinks, setBreadcrumbLinks] = useState<BreadcrumbItem[]>(
		getBreadcrumbLinks() ?? []
	);
	useEffect(() => {
		addLocalStorageEventListener(breadcrumbLinkStorageID, () => {
			const localBreadcrumbLinks = getBreadcrumbLinks() ?? [];
			setBreadcrumbLinks(prevState => {
				return localBreadcrumbLinks;
			});
		});
	}, []);

	const getString = (label: string) => {
		return ` > ${label}`;
	};

	const generateBreadcrumb = useMemo(() => {
		const linkComponents: JSX.Element[] = [];
		if (breadcrumbLinks.length) {
			for (let i = 0; i < breadcrumbLinks.length; i++) {
				const breadcrumbItem = breadcrumbLinks[i];
				if (i !== breadcrumbLinks.length - 1) {
					linkComponents.push(
						<NavItem
							key={breadcrumbItem.route}
							href={breadcrumbItem.route}
							title={breadcrumbItem.label}
						/>
					);
				} else {
					linkComponents.push(
						<Box>
							<Typography key={breadcrumbItem.route} color="text.primary">
								{getString(breadcrumbItem.label)}
							</Typography>
						</Box>
					);
				}
			}
		}
		return linkComponents;
	}, [breadcrumbLinks]);

	return generateBreadcrumb;
}
