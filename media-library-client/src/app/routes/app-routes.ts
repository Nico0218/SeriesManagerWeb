export const RouteLogin = () => {
	return '/Login'
}

export const RouteRoot = () => {
	return '/'
}

export const RouteHome = () => {
	return '/Home'
}

export const RouteHomeImage = () => {
	return '/Home/Folders'
}

export const RouteImages = (FolderID?: string) => {
	return `/Home/Folders/Images/${FolderID ?? ':FolderID'}`  
}

export const RouteHomeVideo = () => {
	return '/Home/Video'
}

export const RouteFolderLocation = () => {
	return '/Settings/FolderLocations'
}
