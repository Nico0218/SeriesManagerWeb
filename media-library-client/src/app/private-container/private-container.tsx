import { Box } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { mainAppBarHeight } from '../constants';
import LoadingComponent from '../custom-components/loading-component/loading-component';
import MainAppBar from './main-app-bar/main-app-bar';

export default function PrivateContainer() {
	return (
		<>
			<MainAppBar />
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
		</>
	);
}
