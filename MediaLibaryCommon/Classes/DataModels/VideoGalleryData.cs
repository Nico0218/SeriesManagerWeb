﻿using MediaLibraryCommon.Classes.LogicModels;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels {
    public class VideoGalleryData : DataModelBase {
        [StringValidator(MaxLength = 36)]
        public string WikiLink { get; set; }

        public VideoGalleryData() {

        }

        public static explicit operator VideoGallery(VideoGalleryData source) {
            VideoGallery destination = new VideoGallery() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                WikiLink = source.WikiLink
            };
            return destination;
        }

        public static explicit operator VideoGalleryData(VideoGallery source) {
            VideoGalleryData destination = new VideoGalleryData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                WikiLink = source.WikiLink
            };
            return destination;
        }
    }
}
