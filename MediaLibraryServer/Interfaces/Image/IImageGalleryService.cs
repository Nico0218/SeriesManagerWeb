using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;

namespace MediaLibraryServer.Interfaces {
    public interface IImageGalleryService: IAbstractLibraryService<Gallery, GalleryData> {             
        Gallery GetGalleryByName(string GalleryName);
        void ProcessNewImageFile(string filePath);
        int GetGalleryImageCount(string GalleryID);
    }
}
