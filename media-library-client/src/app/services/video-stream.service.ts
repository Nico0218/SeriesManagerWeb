import { UseQueryOptions } from "@tanstack/react-query";
import urlCombine from "../functions/url-combine";
import { headers, requestMode, validateOkResponse, videoStreamAPI } from "../classes/http-helper-const";
import { cacheStaleTime } from "../constants";

export default class VideoStreamService {
	private readonly getVideoStreamPath = 'GetVideoStream';
	private readonly getVideoSubtitlesPath = 'GetVideoSubtitles';

	private readonly objName = 'VideoStream';

	GetVideoStream(videoID: string): string {
		return urlCombine(videoStreamAPI, this.getVideoStreamPath, videoID);
		// return {
		// 	queryKey: [`${this.objName}-${this.getVideoStreamPath}`, videoID],
		// 	queryFn: async (): Promise<string> => {
		// 		const url = urlCombine(videoStreamAPI, this.getVideoStreamPath, videoID);
		// 		const res = await fetch(url, {
		// 			headers: headers,
		// 			mode: requestMode,
		// 			credentials: 'include',
		// 		});
		// 		await validateOkResponse(res);
		// 		return await res.clone().json();
		// 	},
		// 	staleTime: cacheStaleTime,
		// };
	}



}
