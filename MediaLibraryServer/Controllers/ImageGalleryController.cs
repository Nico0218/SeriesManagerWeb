using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class ImageGalleryController : ControllerBase {
        private readonly ILogger<ImageGalleryController> logger;
        private readonly IImageGalleryService imageGalleryService;
        private readonly IImageService imageService;

        public ImageGalleryController(ILogger<ImageGalleryController> logger, IImageGalleryService imageGalleryService, IImageService imageService) {
            this.logger = logger;
            this.imageGalleryService = imageGalleryService;
            this.imageService = imageService;
        }

        [HttpGet("GetGalleries")]
        public ObjectResult GetGalleries() {
            return new ObjectResult(imageGalleryService.GetAll());
        }

        [HttpGet("GetGalleryByName/{GalleryName}")]
        public ObjectResult GetGalleryByName(string GalleryName) {
            return new ObjectResult(imageGalleryService.GetGalleryByName(GalleryName));
        }

        [HttpGet("GetAllImagesByGaleryID/{GalleryID}")]
        public ObjectResult GetAllImagesByGaleryID(string GalleryID) {
            return new ObjectResult(imageService.GetAllImagesByGaleryID(GalleryID));
        }

        [HttpGet("GetImageByID/{ImageID}")]
        public ObjectResult GetImageByID(string ImageID) {
            return new ObjectResult(imageService.GetByID(ImageID));
        }

        [HttpGet("GetImageDataByID/{ImageID}")]
        public ObjectResult GetImageDataByID(string ImageID) {
            return new ObjectResult(new { data = imageService.GetImageDataByID(ImageID) });
        }
    }
}
