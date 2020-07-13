using System.IO;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoStreamService
    {
        Stream GetVideoStream(string videoID);
    }
}
