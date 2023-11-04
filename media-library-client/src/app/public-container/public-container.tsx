import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from '../classes/user-info';
import { userInfoKey } from '../constants';
import { setLocalStorageItem } from '../functions/local-storage';
import HttpHelper from '../classes/http-helper';
import dispatchSnackbar from '../functions/dispatch-snackbar';
import { RouteHome } from '../routes/app-routes';

export default function PublicContainer() {
	const navigate = useNavigate();
	const [userName, setUserName] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const onLoginClick = () => {
		HttpHelper.auth.login(
			{ UserName: userName, Password: password },
			() => {
				const userInfo: UserInfo = { name: userName, token: '' };
				setLocalStorageItem(userInfoKey, userInfo);
				navigate(RouteHome());
			},
			err => {
				dispatchSnackbar({ severity: 'error', open: true, message: 'Failed to login' });
			}
		);
	};

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<Typography variant="h2">Login</Typography>
			<Box sx={{ maxWidth: '400px' }}>
				<TextField
					label={'UserName'}
					value={userName}
					onChange={event => {
						setUserName(event.target.value);
					}}
				/>
				<TextField
					label={'Password'}
					value={password}
					onChange={event => {
						setPassword(event.target.value);
					}}
				/>
			</Box>

			<Button variant="outlined" onClick={onLoginClick}>
				Login
			</Button>
		</Box>
	);
}
