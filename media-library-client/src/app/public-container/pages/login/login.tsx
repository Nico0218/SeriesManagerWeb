import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HttpHelper from '../../../classes/http-helper';
import UserInfo from '../../../classes/user-info';
import { userInfoKey } from '../../../constants';
import FormValidator from '../../../custom-components/inputs/form-validator';
import FormValidation from '../../../custom-components/inputs/from-validation';
import ValidatedTextField from '../../../custom-components/inputs/validated-text/validated-text';
import dispatchSnackbar from '../../../functions/dispatch-snackbar';
import { setLocalStorageItem } from '../../../functions/local-storage';
import { RoutePrivateRoot } from '../../../routes/app-routes';

export default function Login() {
	const navigate = useNavigate();
	const [userName, setUserName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const formID = 'LoginForm';
	const [formState, setFormState] = useState(new FormValidator([new FormValidation(formID)]));

	const onLoginClick = () => {
		if (!userName || !password || !formState.IsValid()) {
			dispatchSnackbar({
				message: 'Please provided valid login details',
				severity: 'error',
			});
			return;
		}
		HttpHelper.auth.login(
			{ UserName: userName, Password: password },
			() => {
				const userInfo: UserInfo = { name: userName, token: '' };
				setLocalStorageItem(userInfoKey, userInfo);
				navigate(RoutePrivateRoot());
			},
			err => {
				dispatchSnackbar({ severity: 'error', message: 'Failed to login' });
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
				<ValidatedTextField
					id={'username'}
					label={'UserName'}
					value={userName}
					onChange={value => {
						setUserName(value);
					}}
					onEnterPress={onLoginClick}
					isRequired
					formState={formState}
					setFormState={setFormState}
				/>
				<ValidatedTextField
					id={'password'}
					label={'Password'}
					value={password}
					onChange={value => {
						setPassword(value);
					}}
					onEnterPress={onLoginClick}
					isRequired
					formState={formState}
					setFormState={setFormState}
				/>
			</Box>

			<Button variant="outlined" onClick={onLoginClick}>
				Login
			</Button>
		</Box>
	);
}
