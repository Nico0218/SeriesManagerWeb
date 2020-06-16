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
            return new ObjectResult(imageGalleryService.GetAllGalleries());
        }

        [HttpGet("GetAllImagesByGaleryID/{GalleryID}")]
        public ObjectResult GetAllImagesByGaleryID(string GalleryID) {
            return new ObjectResult(imageGalleryService.GetAllImagesByGaleryID(GalleryID));
        }

        [HttpGet("GetGalleryByName/{GalleryName}")]
        public ObjectResult GetGalleryByName(string GalleryName) {
            return new ObjectResult(imageGalleryService.GetGalleryByName(GalleryName));
        }

        [HttpGet("GetImageByID/{ImageID}")]
        public ObjectResult GetImageByID(string ImageID) {
            return new ObjectResult(imageGalleryService.GetImageByID(ImageID));
        }

        [HttpGet("GetImageDataByID/{ImageID}")]
        public ObjectResult GetImageDataByID(string ImageID) {
            return new ObjectResult(new { data = imageGalleryService.GetImageDataByID(ImageID) });
        }
    }
}
