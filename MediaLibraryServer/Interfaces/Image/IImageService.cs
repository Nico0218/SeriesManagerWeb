using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Models;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IImageService : IAbstractLibraryService<GalleryImage, ImageData> {
        int GetCountByGallery(string GalleryID);
        List<GalleryImage> GetByPage(string GalleryID, int pageNo, int pageSize = 10);
        ImageDataWrapper GetThumbnailByID(string imageID, int ThumbnailSize);
        ImageDataWrapper GetDataByID(string imageID);
    }
}
