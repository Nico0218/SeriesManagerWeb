import { UseQueryOptions } from '@tanstack/react-query';
import {
	ImageAPI,
	handleResponse,
	headers,
	requestMode,
	validateOkResponse,
} from '../classes/http-helper-const';
import { cacheStaleTime } from '../constants';
import urlCombine from '../functions/url-combine';
import GalleryImage from '../interfaces/gallery-images';
import HttpOptions from '../interfaces/http-options';
import ImageDataWrapper from '../interfaces/image-data-wrapper';
import QueryClientWrapper from '../utils/create-query-client';

export default class ImageService {
	private readonly objectType = 'GalleryImage';

	private readonly getCountByGalleryPath = 'GetCountByGallery';
	private readonly getByPagePath = 'GetByPage';
	private readonly getThumbnailByIDPath = 'GetThumbnailByID';
	private readonly getDataByIDPath = 'GetDataByID';
	private readonly deleteByIDPath = 'DeleteByID';

	public async invalidateKeys(id?: string) {
		await QueryClientWrapper.InvalidateKey([`${this.objectType}_${this.getCountByGalleryPath}`]);
		await QueryClientWrapper.InvalidateKey([`${this.objectType}_${this.getByPagePath}`]);
		if (id) {
			await QueryClientWrapper.InvalidateKey([
				`${this.objectType}_${this.getThumbnailByIDPath}`,
				id,
			]);
			await QueryClientWrapper.InvalidateKey([`${this.objectType}_${this.getDataByIDPath}`, id]);
		} else {
			await QueryClientWrapper.InvalidateKey([`${this.objectType}_${this.getThumbnailByIDPath}`]);
			await QueryClientWrapper.InvalidateKey([`${this.objectType}_${this.getDataByIDPath}`]);
		}
	}

	GetCountByGallery(galleryID: string): UseQueryOptions<{ data: number }, Error> {
		return {
			queryKey: [`${this.objectType}_${this.getCountByGalleryPath}`, galleryID],
			queryFn: async (): Promise<{ data: number }> => {
				const url = urlCombine(ImageAPI, this.getCountByGalleryPath, galleryID);
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

	GetByPage(
		galleryID: string,
		pageNo: string,
		pageSize: string
	): UseQueryOptions<GalleryImage[], Error, GalleryImage[]> {
		return {
			queryKey: [`${this.objectType}_${this.getByPagePath}`, galleryID, pageNo, pageSize],
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
			staleTime: cacheStaleTime,
		};
	}

	GetThumbnailByID(
		imageID: string,
		thumbnailSize: string
	): UseQueryOptions<ImageDataWrapper, Error, ImageDataWrapper> {
		return {
			queryKey: [`${this.objectType}_${this.getThumbnailByIDPath}`, imageID, thumbnailSize],
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
			staleTime: cacheStaleTime,
		};
	}

	GetDataByID(imageID: string): UseQueryOptions<ImageDataWrapper, Error, ImageDataWrapper> {
		return {
			queryKey: [`${this.objectType}_${this.getDataByIDPath}`, imageID],
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
			staleTime: cacheStaleTime,
		};
	}

	async DeleteByID(id: string, options?: HttpOptions) {
		const url = urlCombine(ImageAPI, this.deleteByIDPath, id);
		const response = await fetch(url, {
			method: 'DELETE',
			headers: headers,
			mode: requestMode,
			credentials: 'include',
		});
		await handleResponse(response, 'delete', this.objectType, options);
		await this.invalidateKeys();
	}
}
