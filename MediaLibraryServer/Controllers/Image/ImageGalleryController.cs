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

        [HttpGet("GetGalleries")]
        public ObjectResult GetGalleries() {
            return new ObjectResult(imageGalleryService.GetAll());
        }

        [HttpGet("GetGalleryByName/{GalleryName}")]
        public ObjectResult GetGalleryByName(string GalleryName) {
            return new ObjectResult(imageGalleryService.GetGalleryByName(GalleryName));
        }

        [HttpGet("GetGalleryImageCount/{GalleryID}")]
        public ObjectResult GetGalleryImageCount(string GalleryID) {
            return new ObjectResult(new { data = imageGalleryService.GetGalleryImageCount(GalleryID) });
        }
    }
}
