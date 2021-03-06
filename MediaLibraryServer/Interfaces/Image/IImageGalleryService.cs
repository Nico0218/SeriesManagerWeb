﻿using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;

namespace MediaLibraryServer.Interfaces {
    public interface IImageGalleryService: IAbstractLibraryService<Gallery, GalleryData> {             
        Gallery GetByName(string GalleryName);
        void ProcessNewImageFile(string filePath);
    }
}
