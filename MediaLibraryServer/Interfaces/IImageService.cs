using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IImageService : IAbstractLibraryService<Image, ImageData> {
        List<Image> GetAllImagesByGaleryID(string GalleryID);
        string GetImageDataByID(string imageID);
    }
}
