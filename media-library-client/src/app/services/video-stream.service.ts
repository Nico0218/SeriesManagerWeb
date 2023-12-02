import { videoStreamAPI } from "../classes/http-helper-const";
import urlCombine from "../functions/url-combine";

export default class VideoStreamService {
	private readonly getVideoStreamPath = 'GetVideoStream';
	private readonly getVideoSubtitlesPath = 'GetVideoSubtitles';

	private readonly objName = 'VideoStream';

	GetVideoStream(videoID: string): string {
		return urlCombine(videoStreamAPI, this.getVideoStreamPath, videoID);
	}



}
