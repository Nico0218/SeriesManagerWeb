﻿using MediaLibraryServer.Interfaces;
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

        [HttpGet("GetAllSeries")]
        public ObjectResult GetAllSeries() {
            return new ObjectResult(videoGalleryService.GetAll());
        }

        [HttpGet("GetSeriesByID/{SeriesID}")]
        public ObjectResult GetSeriesByID(string SeriesID) {
            return new ObjectResult(videoGalleryService.GetByID(SeriesID));
        }

        [HttpGet("GetSeriesByName/{SeriesName}")]
        public ObjectResult GetSeriesByName(string SeriesName) {
            return new ObjectResult(videoGalleryService.GetSeriesByName(SeriesName));
        }

        [HttpGet("GetEpisodesForSeries/{seriesID}")]
        public ObjectResult GetEpisodesForSeries(string seriesID) {
            return new ObjectResult(videoGalleryService.GetEpisodesForSeries(seriesID));
        }
    }
}
