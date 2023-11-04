import { Box, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';
import NavItem from '../../../app/custom-components/nav-items/nav-item';
import AppRoutes from '../../../app/routes/app-routes';

export default function ErrorPage() {
	const error = useRouteError();
	console.error(error);

	return (
		<Box
			id="error-page"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
			}}
		>
			<h2>Error</h2>
			<Typography>
				<i>{(error as any).statusText || (error as any).message}</i>
			</Typography>
			<NavItem href={AppRoutes.Home} title="Return To Home" />
		</Box>
	);
}
