using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoGalleryService : IAbstractLibraryService<VideoGallery, VideoGalleryData> {
        VideoGallery GetByName(string galleryName);

        void ProcessNewVideoFile(string filePath);
    }
}
