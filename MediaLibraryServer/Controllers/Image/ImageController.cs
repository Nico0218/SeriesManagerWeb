using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers.Image {
    [ApiController]
    [Route("[controller]")]
    public class ImageController : ControllerBase {
        private readonly ILogger<ImageGalleryController> logger;
        private readonly IImageService imageService;

        public ImageController(ILogger<ImageGalleryController> logger, IImageService imageService) {
            this.logger = logger;
            this.imageService = imageService;
        }

        [HttpGet("GetAllImagesByGaleryID/{GalleryID}")]
        public ObjectResult GetAllImagesByGaleryID(string GalleryID) {
            return new ObjectResult(imageService.GetAllImagesByGaleryID(GalleryID));
        }

        [HttpGet("GetImagesByPage/{GalleryID}/{PageNo}/{PageSize}")]
        public ObjectResult GetImagesByPage(string GalleryID, int PageNo, int PageSize) {
            return new ObjectResult(imageService.GetImagesByPage(GalleryID, PageNo, PageSize));
        }

        [HttpGet("GetImageByID/{ImageID}")]
        public ObjectResult GetImageByID(string ImageID) {
            return new ObjectResult(imageService.GetByID(ImageID));
        }

        [HttpGet("GetImageThumbnailByID/{ImageID}/{ThumbnailSize}")]
        public ObjectResult GetImageThumbnailByID(string ImageID, int ThumbnailSize) {
            return new ObjectResult(imageService.GetImageThumbnailByID(ImageID, ThumbnailSize));
        }

        [HttpGet("GetImageDataByID/{ImageID}")]
        public ObjectResult GetImageDataByID(string ImageID) {
            return new ObjectResult(imageService.GetImageDataByID(ImageID));
        }
    }
}
