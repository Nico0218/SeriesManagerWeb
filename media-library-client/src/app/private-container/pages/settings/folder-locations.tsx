import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { AddBreadCrumbItem } from '../../../functions/bread-crumb-functions';
import AppRoutes from '../../../routes/app-routes';

export default function FolderLocations() {
	useEffect(() => {
		AddBreadCrumbItem({ label: 'Folder Location', route: AppRoutes.FolderLocation });
	}, []);

	return (
		<Box>
			<Typography>Folder Location</Typography>
		</Box>
	);
}
