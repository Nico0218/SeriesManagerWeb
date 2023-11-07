import { UseQueryOptions } from '@tanstack/react-query';
import { ImageAPI, headers, isURLSet, requestMode, validateOkResponse } from '../classes/http-helper-const';
import { cacheStaleTime } from '../constants';
import urlCombine from '../functions/url-combine';
import GalleryImage from '../interfaces/gallery-images';
import ImageDataWrapper from '../interfaces/image-data-wrapper';

export default class ImageService {
	private readonly getCountByGalleryPath = 'GetCountByGallery';
	private readonly getByPagePath = 'GetByPage';
	private readonly getByIDPath = 'GetByID';
	private readonly getThumbnailByIDPath = 'GetThumbnailByID';
	private readonly getDataByIDPath = 'GetDataByID'
	private readonly objName = 'Image';

	GetCountByGallery(galleryID: string): UseQueryOptions<number, unknown> {
		return {
			queryKey: [`${this.objName}-${this.getCountByGalleryPath}`],
			queryFn: async (): Promise<number> => {
				const url = urlCombine(ImageAPI, this.getCountByGalleryPath, galleryID);
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

	GetByPage(galleryID: string, pageNo: string, pageSize: string): UseQueryOptions<GalleryImage[], unknown, GalleryImage[]> {
		return {
			queryKey: [`${this.objName}-${this.getByPagePath}`],
			queryFn: async (): Promise<GalleryImage[]> => {
				const url = urlCombine(ImageAPI, this.getByPagePath, galleryID, pageNo, pageSize);
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

	GetByID(imageID: string): UseQueryOptions<GalleryImage, unknown, GalleryImage> {
		return {
			queryKey: [`${this.objName}-${this.getByIDPath}`],
			queryFn: async (): Promise<GalleryImage> => {
				const url = urlCombine(ImageAPI, this.getByIDPath, imageID);
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

	GetThumbnailByID(imageID: string, thumbnailSize: string): UseQueryOptions<ImageDataWrapper, unknown, ImageDataWrapper> {
		return {
			queryKey: [`${this.objName}-${this.getThumbnailByIDPath}`,imageID],
			queryFn: async (): Promise<ImageDataWrapper> => {
				const url = urlCombine(ImageAPI, this.getThumbnailByIDPath, imageID, thumbnailSize);
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

	GetDataByID(imageID: string): UseQueryOptions<ImageDataWrapper, unknown, ImageDataWrapper> {
		return {
			queryKey: [`${this.objName}-${this.getDataByIDPath}`],
			queryFn: async (): Promise<ImageDataWrapper> => {
				const url = urlCombine(ImageAPI, this.getDataByIDPath, imageID);
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
