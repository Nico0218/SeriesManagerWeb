import { userInfoKey } from '../constants';
import dispatchSnackbar from '../functions/dispatch-snackbar';
import { setLocalStorageItem } from '../functions/local-storage';
import urlCombine from '../functions/url-combine';
import AppRoutes from '../routes/app-routes';
import HttpHelper from './http-helper';

export const coreAPI = urlCombine(
	import.meta.env.VITE_SERVER_URL,
	import.meta.env.VITE_SERVER_SUFFIX
);

export const userAPI = urlCombine(coreAPI, 'User');

export const headers = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

export const requestMode: RequestMode = 'cors';

export const isURLSet = () => {
	if (!coreAPI) {
		throw new Error('Server URL has not been configured');
	}
};

export const validateOkResponse = (response: Response) => {
	if (response.status === 200 || response.status === 201) return true;
	if (response.status === 401) {
		dispatchSnackbar({
			open: true,
			message: 'Unauthorized.',
			severity: 'error',
		});
		HttpHelper.auth.logout(
			() => {
				setLocalStorageItem(userInfoKey, undefined);
				window.location.pathname = AppRoutes.Login;
			},
			err =>
				dispatchSnackbar({
					open: true,
					message: err.message ? err.message : err,
					severity: 'error',
				})
		);
		throw new Error('Unauthorized');
	} else if (response.status === 403) {
		dispatchSnackbar({
			open: true,
			message: 'You do not have permission to view this data.',
			severity: 'error',
		});
		throw new Error('You do not have permission to view this data.');
	} else if (response.statusText) {
		dispatchSnackbar({
			open: true,
			message: response.statusText,
			severity: 'error',
		});
		throw new Error(response.statusText);
	}
	return false;
};
