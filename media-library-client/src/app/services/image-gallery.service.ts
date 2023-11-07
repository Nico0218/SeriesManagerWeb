import { UseQueryOptions } from '@tanstack/react-query';
import { ImageGalleryAPI, headers, isURLSet, requestMode, validateOkResponse } from '../classes/http-helper-const';
import urlCombine from '../functions/url-combine';
import GalleryData from '../interfaces/gallery-data';
import { cacheStaleTime } from '../constants';
 
export default class ImageGalleryService {
    private readonly getAllPath = 'GetAll';
	private readonly getByIDPath = 'GetByID';
	private readonly objName = 'ImageGallery';


    GetAll(): UseQueryOptions<GalleryData[], unknown, GalleryData[]> {
		return {
			queryKey: [`${this.objName}-${this.getAllPath}`],
			queryFn: async (): Promise<GalleryData[]> => {
				const url = urlCombine(ImageGalleryAPI, this.getAllPath);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime
		}
	}

    GetByID(imageID: string): UseQueryOptions<GalleryData, unknown, GalleryData> {
		return {
			queryKey: [`${this.objName}-${this.getByIDPath}`],
			queryFn: async (): Promise<GalleryData> => {
				const url = urlCombine(ImageGalleryAPI, this.getByIDPath, imageID);
				const res = await fetch(url, {
					headers: headers,
					mode: requestMode,
					credentials: 'include',
				});
				await validateOkResponse(res);
				return await res.clone().json();
			},
			staleTime: cacheStaleTime
		}
	}

}