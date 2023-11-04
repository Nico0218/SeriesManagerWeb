import AuthHttpService from '../services/auth-http.service';
import ConfigHttpService from '../services/config-http.service';
import ImageGalleryService from '../services/image-gallery.service';
import ImageService from '../services/image.service';
import VideoGalleryService from '../services/video-gallery.service';
import VideoStreamService from '../services/video-stream.service';
import VideoService from '../services/video.service';

export default class HttpHelper {
	static auth = new AuthHttpService();
	static imageGallery = new ImageGalleryService();
	static image = new ImageService();
	static config = new ConfigHttpService();
	static videoGallery = new VideoGalleryService();
	static video = new VideoService();
	static videoStream = new VideoStreamService();
}
