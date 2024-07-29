import { UseQueryOptions } from '@tanstack/react-query';
import { headers, requestMode, validateOkResponse, videoAPI } from '../classes/http-helper-const';
import { cacheStaleTime } from '../constants';
import urlCombine from '../functions/url-combine';
import Video from '../interfaces/video';

export default class VideoService {
	private readonly getByGalleryPath = 'GetByGallery';
	private readonly getCountByGalleryPath = 'GetCountByGallery';
	private readonly getByPagePath = 'GetByPage';

	private readonly objName = 'Video';

	GetByGallery(galleryID: string): UseQueryOptions<Video[], unknown, Video[]> {
		return {
			queryKey: [`${this.objName}-${this.getByGalleryPath}`, galleryID],
			queryFn: async (): Promise<Video[]> => {
				const url = urlCombine(videoAPI, this.getByGalleryPath, galleryID);
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

	GetCountByGallery(
		galleryID: string
	): UseQueryOptions<{ data: number }, unknown, { data: number }> {
		return {
			queryKey: [`${this.objName}-${this.getCountByGalleryPath}`, galleryID],
			queryFn: async (): Promise<{ data: number }> => {
				const url = urlCombine(videoAPI, this.getCountByGalleryPath, galleryID);
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
		pageNo: number,
		pageSize: number
	): UseQueryOptions<Video[], unknown, Video[]> {
		return {
			queryKey: [`${this.objName}-${this.getByPagePath}`, galleryID, pageNo, pageSize],
			queryFn: async (): Promise<Video[]> => {
				const url = urlCombine(
					videoAPI,
					this.getByPagePath,
					galleryID,
					pageNo.toString(),
					pageSize.toString()
				);
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
}
