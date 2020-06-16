using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class VideoGalleryController : ControllerBase {
        private readonly ILogger<VideoGalleryController> logger;
        private readonly IVideoLibraryService videoLibraryService;

        public VideoGalleryController(ILogger<VideoGalleryController> logger, IVideoLibraryService videoLibraryService) {
            this.logger = logger;
            this.videoLibraryService = videoLibraryService;
        }

        [HttpGet("GetAllSeries")]
        public ObjectResult GetAllSeries() {
            return new ObjectResult(videoLibraryService.GetAllSeries());
        }

        [HttpGet("GetSeriesByID/{SeriesID}")]
        public ObjectResult GetSeriesByID(string SeriesID) {
            return new ObjectResult(videoLibraryService.GetSeriesByID(SeriesID));
        }

        [HttpGet("GetSeriesByName/{SeriesName}")]
        public ObjectResult GetSeriesByName(string SeriesName) {
            return new ObjectResult(videoLibraryService.GetSeriesByName(SeriesName));
        }

        [HttpGet("GetEpisodesForSeries/{seriesID}")]
        public ObjectResult GetEpisodesForSeries(string seriesID) {
            return new ObjectResult(videoLibraryService.GetEpisodesForSeries(seriesID));
        }
    }
}
