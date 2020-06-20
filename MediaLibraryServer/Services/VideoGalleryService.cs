using DBProviderBase.Classes;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class VideoGalleryService : IVideoLibraryService {
        private readonly ILogger<VideoGalleryService> logger;
        private readonly IDataService dataService;

        public VideoGalleryService(ILogger<VideoGalleryService> logger, IDataService dataService) {
            this.logger = logger;
            this.dataService = dataService;
        }

        public List<SeriesInformation> GetAllSeries() {
            logger.LogDebug("Getting all series.");
            List<SeriesInformationData> seriesInformationData = dataService.GetObjectData<SeriesInformationData>();
            List<SeriesInformation> seriesInformation = new List<SeriesInformation>();
            foreach (var item in seriesInformationData) {
                seriesInformation.Add((SeriesInformation)item);
            }
            logger.LogDebug($"Returning {seriesInformation.Count} series.");
            return seriesInformation;
        }

        public SeriesInformation GetSeriesByName(string seriesName) {
            if (seriesName is null) {
                throw new ArgumentNullException(nameof(seriesName));
            }
            logger.LogDebug($"Getting series {seriesName}");

            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "Name", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = seriesName });
            SeriesInformationData seriesInformationData = dataService.GetObjectData<SeriesInformationData>(parameters).FirstOrDefault();
            if (seriesInformationData == null) {
                logger.LogDebug($"Could not find series {seriesName}");
                return null;
            }
            logger.LogDebug($"Returning series {seriesName}");
            return (SeriesInformation)seriesInformationData;
        }

        public SeriesInformation GetSeriesByID(string seriesID) {
            if (seriesID is null) {
                throw new ArgumentNullException(nameof(seriesID));
            }
            logger.LogDebug($"Getting series {seriesID}");

            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "ID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = seriesID });
            SeriesInformationData seriesInformationData = dataService.GetObjectData<SeriesInformationData>(parameters).FirstOrDefault();
            if (seriesInformationData == null) {
                logger.LogDebug($"Could not find series {seriesID}");
                return null;
            }
            logger.LogDebug($"Returning series {seriesID}");
            return (SeriesInformation)seriesInformationData;
        }

        public void SaveSeries(SeriesInformation seriesInformation) {
            if (seriesInformation is null) {
                throw new ArgumentNullException(nameof(seriesInformation));
            }

            logger.LogDebug($"Saving series {seriesInformation.DisplayName}");
            dataService.InsertObjectData((SeriesInformationData)seriesInformation);
            logger.LogDebug($"Saved series {seriesInformation.DisplayName}");
        }

        public List<Video> GetEpisodesForSeries(string seriesID) {
            if (seriesID is null) {
                throw new ArgumentNullException(nameof(seriesID));
            }
            logger.LogDebug($"Getting episodes for series {seriesID}");

            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "SeriesID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = seriesID });
            List<VideoData> videoDatas = dataService.GetObjectData<VideoData>(parameters);
            List<Video> episodes = new List<Video>();
            foreach (var item in videoDatas) {
                episodes.Add((Video)item);
            }
            logger.LogDebug($"Returning {episodes.Count} episodes for series {seriesID}");
            return episodes;
        }

        public Video GetEpisodeByID(string episodeID) {
            if (episodeID is null) {
                throw new ArgumentNullException(nameof(episodeID));
            }
            logger.LogDebug($"Getting episode {episodeID}");
            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "ID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = episodeID });
            VideoData videoData = dataService.GetObjectData<VideoData>(parameters).FirstOrDefault();
            if (videoData == null) {
                logger.LogDebug($"Failed to get episode {episodeID}");
                return null;
            }
            Video video = (Video)videoData;
            logger.LogDebug($"Returning episode {episodeID}");
            return video;
        }

        public void SaveEpisode(Video episode) {
            if (episode is null) {
                throw new ArgumentNullException(nameof(episode));
            }
            logger.LogDebug($"Saving episode {episode.DisplayName}");
            dataService.InsertObjectData((VideoData)episode);
            logger.LogDebug($"Saved episode {episode.DisplayName}");
        }
    }
}
