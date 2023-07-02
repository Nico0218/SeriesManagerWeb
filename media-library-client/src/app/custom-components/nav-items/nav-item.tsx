import { ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavItemProperties from './nav-item-properties';
import ChevronRight from '@mui/icons-material/ChevronRight';

export default function NavItem({ title, href, style, onClick, children }: NavItemProperties) {
	const location = useLocation();
	const theme = useTheme();
	const active = location.pathname === href;

	const defaultStyle: CSSProperties = {
		textDecoration: 'none',
		display: 'flex',
		backgroundColor: 'transparent',
	};

	return (
		<Link to={href} style={style ? { ...defaultStyle, ...style } : defaultStyle}>
			<ListItemButton
				key={href}
				onClick={onClick}
				sx={{
					borderRadius: 2,
					...(active && {
						backgroundColor: theme => theme.palette.common.custom.navActiveBackground,
					}),
					':hover': {
						...(active && {
							backgroundColor: theme => theme.palette.common.custom.navActiveBackground,
						}),
					},
					'& .MuiTouchRipple-child': {
						backgroundColor: theme => theme.palette.common.custom.navActiveBackground,
					},
					padding: 0,
				}}
			>
				<ChevronRight sx={{ color: theme.palette.common.white }} />
				<ListItemText
					sx={{ margin: 0, display: 'flex' }}
					primary={
						<Typography
							variant="bodySmall"
							letterSpacing="0.01em"
							color={theme.palette.common.white}
						>
							{title}
						</Typography>
					}
				/>
				{children}
			</ListItemButton>
		</Link>
	);
}
