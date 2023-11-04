import { AuthHttpService } from '../services/auth-http.service';
import { ImageGalleryService } from '../services/image-gallery.service' ;
import { ImageService } from '../services/image-service' ;

export default class HttpHelper {
	static auth = new AuthHttpService();
	static ImageGallery = new ImageGalleryService();
	static Image = new ImageService();
}
