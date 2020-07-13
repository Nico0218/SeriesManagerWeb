using DBProviderBase.Classes;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class VideoGalleryService : AbstractLibraryService<SeriesInformation, SeriesInformationData>, IVideoGalleryService {

        public VideoGalleryService(ILogger<VideoGalleryService> logger, IDataService dataService) : base(logger, dataService) {
        }

        public SeriesInformation GetSeriesByName(string seriesName) {
            if (seriesName is null) {
                throw new ArgumentNullException(nameof(seriesName));
            }
            logger.LogDebug($"Getting series {seriesName}");

            List<IParameter> parameters = new List<IParameter>();

            parameters.Add(new Parameter() { ColumnName = "Name", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = seriesName.Replace(" ", "").Trim() });
            SeriesInformationData seriesInformationData = dataService.GetObjectData<SeriesInformationData>(parameters).FirstOrDefault();
            if (seriesInformationData == null) {
                logger.LogDebug($"Could not find series {seriesName}");
                return null;
            }
            logger.LogDebug($"Returning series {seriesName}");
            return (SeriesInformation)seriesInformationData;
        }
    }
}
