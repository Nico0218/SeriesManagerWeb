using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class VideoGalleryController : ControllerBase {
        private readonly ILogger<VideoGalleryController> logger;
        private readonly IVideoGalleryService videoGalleryService;

        public VideoGalleryController(ILogger<VideoGalleryController> logger, IVideoGalleryService videoGalleryService) {
            this.logger = logger;
            this.videoGalleryService = videoGalleryService;
        }

        [HttpGet("GetAll")]
        public ObjectResult GetAll() {
            logger.LogInformation("Getting all Video Galleries");
            return new ObjectResult(videoGalleryService.GetAll());
        }

        [HttpGet("GetByID/{GalleryID}")]
        public ObjectResult GetByID(string GalleryID) {
            logger.LogInformation($"Getting Video Gallery by ID: {GalleryID}");
            return new ObjectResult(videoGalleryService.GetByID(GalleryID));
        }

        [HttpGet("GetByName/{GalleryName}")]
        public ObjectResult GetByName(string GalleryName) {
            logger.LogInformation($"Getting Video Gallery by Name: {GalleryName}");
            return new ObjectResult(videoGalleryService.GetByName(GalleryName));
        }

        
    }
}
