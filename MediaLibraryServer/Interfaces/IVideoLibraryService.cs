using MediaLibraryServer.Classes.LogicModels;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoLibraryService {
        SeriesInformation GetSeriesByName(string seriesName);
        SeriesInformation GetSeriesByID(string seriesID);
        List<SeriesInformation> GetAllSeries();
        void SaveSeries(SeriesInformation seriesInformation);
        List<Video> GetEpisodesForSeries(string seriesID);
        Video GetEpisodeByID(string episodeID);
        void SaveEpisode(Video episode);
    }
}
