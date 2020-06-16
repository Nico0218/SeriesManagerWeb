﻿using MediaLibraryServer.Classes.LogicModels;

namespace MediaLibraryServer.Classes.DataModels {
    public class GalleryData : DataModelBase {
        //This needs to be reworked into a proper file store
        public string FileStore { get; set; }

        public static explicit operator Gallery(GalleryData source) {
            Gallery destination = new Gallery() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FileStore = source.FileStore
            };
            return destination;
        }

        public static explicit operator GalleryData(Gallery source) {
            GalleryData destination = new GalleryData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FileStore = source.FileStore
            };
            return destination;
        }
    }
}
