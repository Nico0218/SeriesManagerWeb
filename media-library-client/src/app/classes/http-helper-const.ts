import dispatchSnackbar from '../functions/dispatch-snackbar';
import urlCombine from '../functions/url-combine';
import HttpOptions from '../interfaces/http-options';

export const coreAPI = urlCombine(
	import.meta.env.VITE_SERVER_URL,
	import.meta.env.VITE_SERVER_SUFFIX
);

export const userAPI = urlCombine(coreAPI, 'User');
export const ImageGalleryAPI = urlCombine(coreAPI, 'ImageGallery');
export const ImageAPI = urlCombine(coreAPI, 'Image');
export const configAPI = urlCombine(coreAPI, 'Config');

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

export const validateOkResponse = async (response: Response) => {
	if (response.status === 200 || response.status === 201) return true;
	const result = await response.clone().json();
	let message = response.statusText;
	if (Object.hasOwn(result, 'message')) {
		message = result.message;
	}
	if (response.status === 401) {
		dispatchSnackbar({
			message: `Unauthorized - ${message}`,
			severity: 'error',
		});
		// if (GetSessionUser()) {
		// 	HttpHelper.auth.logout();
		// }
		return;
	} else if (response.status === 403) {
		dispatchSnackbar({
			message: 'You do not have permission to view this data.',
			severity: 'error',
		});
		// window.location.pathname = AppRoutes.Unauthorized();
		return;
	} else if (response.statusText) {
		dispatchSnackbar({
			message: message,
			severity: 'error',
		});
	}
	throw new Error(message);
};

export const handleResponse = async (
	response: Response,
	request: string,
	objectType: string,
	options?: HttpOptions
) => {
	try {
		const isOK = await validateOkResponse(response);
		if (
			isOK &&
			(response.status === 200 || response.status === 201) &&
			options &&
			options.success
		) {
			const clone = response.clone();
			if (clone.headers.get('Content-Type')?.includes('application/json')) {
				const jsonRes = await response.clone().json();
				options.success(jsonRes);
				return;
			}
			options.success(response.clone().ok);
			return;
		}
	} catch (err) {
		dispatchSnackbar({
			message: `Failed ${request} on ${objectType}.`,
			severity: 'error',
		});
		if (options?.error) {
			options.error(err);
		}
	}
};
