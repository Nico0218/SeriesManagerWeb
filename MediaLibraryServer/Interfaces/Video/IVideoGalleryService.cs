using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoGalleryService : IAbstractLibraryService<SeriesInformation, SeriesInformationData> {
        SeriesInformation GetSeriesByName(string seriesName);

        void ProcessNewVideoFile(string filePath);
    }
}
