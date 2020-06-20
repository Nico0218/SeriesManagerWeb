using MediaLibraryCommon.Classes.LogicModels;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IImageGalleryService {
        void SaveGallery(Gallery gallery);
        List<Gallery> GetAllGalleries();        
        Gallery GetGalleryByName(string GalleryName);
        List<Image> GetAllImagesByGaleryID(string GalleryID);
        Image GetImageByID(string imageID);
        void SaveImage(Image image);
        string GetImageDataByID(string imageID);
    }
}
