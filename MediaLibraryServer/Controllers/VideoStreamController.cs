using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class VideoStreamController : ControllerBase
    {
        private readonly ILogger<VideoStreamController> _logger;
        private readonly IVideoStreamService videoStreamService;

        public VideoStreamController(ILogger<VideoStreamController> logger, IVideoStreamService videoStreamService, IVideoLibraryService videoLibraryService)
        {
            _logger = logger;
            this.videoStreamService = videoStreamService;
        }

        [HttpGet("GetVideoStream/{videoID}")]
        public FileStreamResult GetVideoStream(string videoID) {
            FileStreamResult fileStreamResult = new FileStreamResult(videoStreamService.GetVideoStream(videoID), "video/mp4");
            fileStreamResult.EnableRangeProcessing = true;
            return fileStreamResult;
        }
    }
}
