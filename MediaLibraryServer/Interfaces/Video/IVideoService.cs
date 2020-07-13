using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoService : IAbstractLibraryService<Video, VideoData> {
        List<Video> GetEpisodesForSeries(string seriesID);
    }
}
