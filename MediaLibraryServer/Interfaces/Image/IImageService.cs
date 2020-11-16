using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Models;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IImageService : IAbstractLibraryService<GalleryImage, ImageData> {
        List<GalleryImage> GetAllImagesByGaleryID(string GalleryID);
        List<GalleryImage> GetImagesByPage(string GalleryID, int pageNo, int pageSize = 10);
        ImageDataWrapper GetImageDataByID(string imageID);
        ImageDataWrapper GetImageThumbnailByID(string imageID, int ThumbnailSize);
        int GetGalleryImageCount(string GalleryID);
    }
}
