using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class ImageGalleryController : ControllerBase {
        private readonly ILogger<ImageGalleryController> logger;
        private readonly IImageGalleryService imageGalleryService;

        public ImageGalleryController(ILogger<ImageGalleryController> logger, IImageGalleryService imageGalleryService) {
            this.logger = logger;
            this.imageGalleryService = imageGalleryService;
        }

        [HttpGet("GetAll")]
        public ObjectResult GetAll() {
            logger.LogInformation("Getting all image galleries");
            return new ObjectResult(imageGalleryService.GetAll());
        }

        [HttpGet("GetByID/{GalleryID}")]
        public ObjectResult GetByID(string GalleryID) {
            logger.LogInformation($"Getting Video Gallery by ID: {GalleryID}");
            return new ObjectResult(imageGalleryService.GetByID(GalleryID));
        }

        [HttpGet("GetByName/{GalleryName}")]
        public ObjectResult GetByName(string GalleryName) {
            logger.LogInformation($"Getting image gallery by name: {GalleryName}");
            return new ObjectResult(imageGalleryService.GetByName(GalleryName));
        }

        
    }
}
