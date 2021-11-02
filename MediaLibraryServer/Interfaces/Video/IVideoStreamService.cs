using MediaLibraryCommon.Classes.Models;
using System.Collections.Generic;
using System.IO;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoStreamService {
        Stream GetVideoStream(string videoID);
        List<SubtitlesWrapper> GetVideoSubtitles(string videoID);
    }
}
