using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Models;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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

        public List<SubtitlesWrapper> GetVideoSubtitles(string videoID) {
            if (videoID is null) {
                throw new ArgumentNullException(nameof(videoID));
            }
            logger.LogDebug($"Getting video subtitles for video {videoID}");
            Video video = videoService.GetByID(videoID);
            string videoDir = Path.GetDirectoryName(video.FilePath);
            List<SubtitlesWrapper> subtitles = new List<SubtitlesWrapper>();
            foreach (string subTitlePath in Directory.GetFiles(videoDir, "*.vtt")) {
                if (string.IsNullOrEmpty(subTitlePath)) {
                    throw new Exception($"Failed to find subtitles for {video.DisplayName}");
                }
                string fileName = Path.GetFileNameWithoutExtension(subTitlePath);
                string[] NameParts = fileName.Split("-");
                SubtitlesWrapper subtitlesWrapper = new SubtitlesWrapper();
                subtitlesWrapper.Title = NameParts[2].Trim();
                subtitlesWrapper.Language = "en"; //NameParts[1]; //Needs some work here
                subtitlesWrapper.Data = Convert.ToBase64String(File.ReadAllBytes(subTitlePath));
                subtitles.Add(subtitlesWrapper);
            }
            return subtitles;
        }
    }
}
