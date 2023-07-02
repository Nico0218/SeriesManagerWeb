import { AuthHttpService } from '../services/auth-http.service';

export default class HttpHelper {
	static auth = new AuthHttpService();
}
