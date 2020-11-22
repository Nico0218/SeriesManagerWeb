using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class VideoStreamController : ControllerBase {
        private readonly ILogger<VideoStreamController> logger;
        private readonly IVideoStreamService videoStreamService;

        public VideoStreamController(ILogger<VideoStreamController> logger, IVideoStreamService videoStreamService) {
            this.logger = logger;
            this.videoStreamService = videoStreamService;
        }

        [HttpGet("GetVideoStream/{videoID}")]
        public FileStreamResult GetVideoStream(string videoID) {
            logger.LogInformation($"Starting video stream for video ID: {videoID}");
            FileStreamResult fileStreamResult = new FileStreamResult(videoStreamService.GetVideoStream(videoID), "video/mp4");
            fileStreamResult.EnableRangeProcessing = true;
            return fileStreamResult;
        }

        [HttpGet("GetVideoSubtitles/{videoID}")]
        public ObjectResult GetVideoSubtitles(string videoID) {
            logger.LogInformation($"Get subtitles for video: {videoID}");
            return new ObjectResult(new { data = videoStreamService.GetVideoSubtitles(videoID) });
        }
    }
}
