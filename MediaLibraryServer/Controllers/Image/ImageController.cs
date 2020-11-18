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

        [HttpGet("GetCountByGallery/{GalleryID}")]
        public ObjectResult GetCountByGallery(string GalleryID) {
            logger.LogInformation($"Getting images by gallery ID: {GalleryID}");
            return new ObjectResult(new { data = imageService.GetCountByGallery(GalleryID) });
        }

        [HttpGet("GetByPage/{GalleryID}/{PageNo}/{PageSize}")]
        public ObjectResult GetByPage(string GalleryID, int PageNo, int PageSize) {
            logger.LogInformation($"Getting images by gallery ID: {GalleryID} - Page Number: {PageNo} - Page Size: {PageSize}");
            return new ObjectResult(imageService.GetByPage(GalleryID, PageNo, PageSize));
        }

        [HttpGet("GetByID/{ImageID}")]
        public ObjectResult GetByID(string ImageID) {
            logger.LogInformation($"Getting image by image ID: {ImageID}");
            return new ObjectResult(imageService.GetByID(ImageID));
        }

        [HttpGet("GetThumbnailByID/{ImageID}/{ThumbnailSize}")]
        public ObjectResult GetThumbnailByID(string ImageID, int ThumbnailSize) {
            logger.LogInformation($"Getting image thumbnail by image ID: {ImageID} - ThumbnailSize: {ThumbnailSize}");
            return new ObjectResult(imageService.GetThumbnailByID(ImageID, ThumbnailSize));
        }

        [HttpGet("GetDataByID/{ImageID}")]
        public ObjectResult GetDataByID(string ImageID) {
            logger.LogInformation($"Getting image data by image ID: {ImageID}");
            return new ObjectResult(imageService.GetDataByID(ImageID));
        }
    }
}
