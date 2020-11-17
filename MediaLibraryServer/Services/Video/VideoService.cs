using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace MediaLibraryServer.Services {
    public class VideoService : AbstractLibraryService<Video, VideoData>, IVideoService {
        public VideoService(ILogger<VideoService> logger, IDataService dataService, IMemoryCache memoryCache) : base(logger, dataService, memoryCache) {

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
    }
}
