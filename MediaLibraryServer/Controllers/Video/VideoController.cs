using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers.Video {
    [ApiController]
    [Route("[controller]")]
    public class VideoController : ControllerBase {
        private readonly ILogger<VideoGalleryController> logger;
        private readonly IVideoService videoService;

        public VideoController(ILogger<VideoGalleryController> logger, IVideoService videoService) {
            this.logger = logger;
            this.videoService = videoService;
        }

        [HttpGet("GetByGallery/{GalleryID}")]
        public ObjectResult GetByGallery(string GalleryID) {
            logger.LogInformation($"Getting videos by gallery ID: {GalleryID}");
            return new ObjectResult(videoService.GetByGallery(GalleryID));
        }

        [HttpGet("GetCountByGallery/{GalleryID}")]
        public ObjectResult GetCountByGallery(string GalleryID) {
            logger.LogInformation($"Getting video count by gallery ID: {GalleryID}");
            return new ObjectResult(videoService.GetCountByGallery(GalleryID));
        }

        [HttpGet("GetByPage/{GalleryID}/{PageNo}/{PageSize}")]
        public ObjectResult GetByPage(string GalleryID, int PageNo, int PageSize) {
            logger.LogInformation($"Getting videos by Gallery ID:{GalleryID} - Page Number: {PageNo} - Page Size: {PageSize}");
            return new ObjectResult(videoService.GetByPage(GalleryID, PageNo, PageSize));
        }
    }
}
