using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace MediaLibraryServer.Services {
    public class VideoStreamService : IVideoStreamService {
        private const string msgStreamError = "Stream Failed";
        private readonly ILogger<VideoStreamService> logger;
        private readonly IVideoService videoService;

        public VideoStreamService(ILogger<VideoStreamService> logger, IVideoService videoService) {
            this.logger = logger;
            this.videoService = videoService;
        }

        public Stream GetVideoStream(string videoID) {
            if (videoID is null) {
                throw new ArgumentNullException(nameof(videoID));
            }
            logger.LogDebug($"Getting video stream for episode {videoID}");
            Video video = videoService.GetByID(videoID);
            if (video == null) {
                logger.LogError($"Failed to find episode {videoID}");
                throw new FileNotFoundException($"Failed to find episode {videoID}");
            }

            try {
                return File.OpenRead(video.FilePath);
            } catch (Exception ex) {
                logger.LogError(msgStreamError, ex);
                throw;
            }
        }

        public string GetVideoSubtitles(string videoID) {
            if (videoID is null) {
                throw new ArgumentNullException(nameof(videoID));
            }
            logger.LogDebug($"Getting video subtitles for video {videoID}");
            string subtileSource = @"C:\inetpub\wwwroot\SeriesManagerWeb\SeriesManagerServer\Resources\upc-video-subtitles-en.vtt";
            return Convert.ToBase64String(File.ReadAllBytes(subtileSource));
        }
    }
}
