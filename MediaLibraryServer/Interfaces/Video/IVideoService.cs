using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IVideoService : IAbstractLibraryService<Video, VideoData> {
        List<Video> GetByGallery(string galleryID);
        public int GetCountByGallery(string galleryID);
        List<Video> GetByPage(string galleryID, int pageNo, int pageSize = 10);
    }
}
