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

        public Stream GetVideoStream(string episodeID) {
            if (episodeID is null) {
                throw new ArgumentNullException(nameof(episodeID));
            }
            logger.LogDebug($"Getting video stream for episode {episodeID}");
            Video video = videoService.GetByID(episodeID);
            if (video == null) {
                logger.LogError($"Failed to find episode {episodeID}");
                throw new FileNotFoundException($"Failed to find episode {episodeID}");
            }

            try {
                return File.OpenRead(video.FilePath);
            } catch (Exception ex) {
                logger.LogError(msgStreamError, ex);
                throw;
            }
        }
    }
}
