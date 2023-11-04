import { ChevronRight } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { breadcrumbLinkStorageID } from '../../../constants';
import NavItem from '../../../custom-components/nav-items/nav-item';
import { getBreadcrumbLinks } from '../../../functions/bread-crumb-functions';
import { addLocalStorageEventListener } from '../../../functions/local-storage';
import BreadcrumbItem from './breadcrumb-item';

export default function BreadCrumb() {
	const theme = useTheme();
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
						<Box key={'last-item'} sx={{ display: 'flex' }}>
							<ChevronRight sx={{ color: theme.palette.common.white }} />
							<Typography key={breadcrumbItem.route} color="text.primary">
								{breadcrumbItem.label}
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
