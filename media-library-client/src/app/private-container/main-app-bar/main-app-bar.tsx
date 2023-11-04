import { AppBar, Box } from '@mui/material';
import BreadCrumb from './breadcrumb/breadcrumb';
import { DropdownMenu } from './dropdown-menu/dropdown-menu';
import { mainAppBarHeight } from '../../constants';

export default function MainAppBar() {
	return (
		<AppBar
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				px: 2,
				minHeight: `${mainAppBarHeight}px`,
				maxHeight: `${mainAppBarHeight}px`,
			}}
		>
			<Box
				sx={{
					width: 'calc(100% - 120px)',
					height: '100%',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<BreadCrumb />
			</Box>
			<Box
				sx={{
					width: '120px',
					height: '100%',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<DropdownMenu />
			</Box>
		</AppBar>
	);
}
