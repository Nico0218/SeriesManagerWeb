import { UseQueryOptions } from '@tanstack/react-query';
import FolderLibrary from '../classes/folder-library';
import {
	handleResponse,
	headers,
	requestMode,
	validateOkResponse,
	videoGalleryAPI,
} from '../classes/http-helper-const';
import { cacheStaleTime } from '../constants';
import urlCombine from '../functions/url-combine';
import HttpOptions from '../interfaces/http-options';
import IVideoGallery from '../interfaces/video-gallery';
import QueryClientWrapper from '../utils/create-query-client';

export default class VideoGalleryService {
	private readonly getAllPath = 'GetAll';
	private readonly getByIDPath = 'GetByID';
	private readonly getByNamePath = 'GetByName';
	private readonly savePath = 'Save';

	private readonly objName = 'VideoGallery';

	GetAll(): UseQueryOptions<IVideoGallery[], unknown, IVideoGallery[]> {
		return {
			queryKey: [`${this.objName}-${this.getAllPath}`],
			queryFn: async (): Promise<IVideoGallery[]> => {
				const url = urlCombine(videoGalleryAPI, this.getAllPath);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime,
		};
	}

	GetByID(galleryID: string): UseQueryOptions<IVideoGallery, unknown, IVideoGallery> {
		return {
			queryKey: [`${this.objName}-${this.getByIDPath}`, galleryID],
			queryFn: async (): Promise<IVideoGallery> => {
				const url = urlCombine(videoGalleryAPI, this.getByIDPath, galleryID);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime,
		};
	}

	GetByName(galleryName: string): UseQueryOptions<IVideoGallery, unknown, IVideoGallery> {
		return {
			queryKey: [`${this.objName}-${this.getByNamePath}`, galleryName],
			queryFn: async (): Promise<IVideoGallery> => {
				const url = urlCombine(videoGalleryAPI, this.getByNamePath, galleryName);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime,
		};
	}

	async Save(objects: IVideoGallery, options?: HttpOptions) {
		const url = urlCombine(videoGalleryAPI, this.savePath);
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(objects),
			mode: requestMode,
			credentials: 'include',
		});
		await handleResponse(response, 'save', FolderLibrary.name, options);
		await QueryClientWrapper.InvalidateKey([`${this.objName}-${this.getAllPath}`]);
		await QueryClientWrapper.InvalidateKey([`${this.objName}-${this.getByIDPath}`]);
		await QueryClientWrapper.InvalidateKey([`${this.objName}-${this.getByNamePath}`]);
	}
}
