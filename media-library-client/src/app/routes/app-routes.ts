export const RoutePublicRoot = () => {
	return '/LandingPage';
};

export const RouteLogin = () => {
	return '/LandingPage/Login';
};

export const RoutePrivateRoot = () => {
	return '/';
};

export const RouteImageGallery = () => {
	return '/Home/ImageGallery';
};

export const RouteImages = (imageGalleryID?: string) => {
	return `/Home/ImageGallery/${imageGalleryID ?? ':imageGalleryID'}`;
};

export const RouteVideoGallery = () => {
	return '/Home/VideoGallery';
};

export const RouteVideos = (videoGalleryID?: string) => {
	return `/Home/VideoGallery/${videoGalleryID ?? ':videoGalleryID'}`;
};

export const RouteFolderLocation = () => {
	return '/Settings/FolderLocations';
};
