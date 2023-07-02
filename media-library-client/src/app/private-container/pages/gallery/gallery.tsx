import { Box } from '@mui/material';
import { useEffect } from 'react';
import CustomCard from '../../../custom-components/custom-card/custom-card';
import { AddBreadCrumbItem } from '../../../functions/bread-crumb-functions';
import AppRoutes from '../../../routes/app-routes';

export default function Gallery() {
	useEffect(() => {
		AddBreadCrumbItem({ label: 'Gallery', route: AppRoutes.Gallery });
	}, []);

	return (
		<Box>
			<CustomCard />
		</Box>
	);
}
