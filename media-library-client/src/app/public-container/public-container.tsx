import { Box } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { mainAppBarHeight } from '../constants';
import LoadingComponent from '../custom-components/loading-component/loading-component';

export default function PublicContainer() {
	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				paddingTop: `${mainAppBarHeight}px`,
				px: 2,
			}}
		>
			<Suspense fallback={<LoadingComponent />}>
				<Outlet />
			</Suspense>
		</Box>
	);
}
