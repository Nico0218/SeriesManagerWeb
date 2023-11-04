import { userAPI, headers, isURLSet, requestMode } from '../classes/http-helper-const';
import urlCombine from '../functions/url-combine';
import LoginRequest from '../interfaces/login-request';

export default class AuthHttpService {
	login(login: LoginRequest, success: () => void, error: (data: any) => void) {
		isURLSet();
		const url = urlCombine(userAPI, 'Login');
		fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(login),
			mode: requestMode,
			credentials: 'include',
		})
			.then(res => {
				if (res.status === 201) {
					success();
				} else {
					error(`Unauthorized.`);
				}
			})
			.catch(err => error(err));
	}

	logout(success: () => void, error: (data: any) => void) {
		isURLSet();
		const url = urlCombine(userAPI, 'Logout');
		fetch(url, {
			method: 'POST',
			headers: headers,
			body: null,
			mode: requestMode,
			credentials: 'include',
		})
			.then(() => success())
			.catch(err => error(err));
	}
}
