using MediaLibraryCommon.Classes.LogicModels;
using System;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels {
    public class VideoData : DataModelBase, IFileItemData {
        [StringValidator(MaxLength = 1000)]
        public string FilePath { get; set; }
        public DateTime IndexDate { get; set; }
        public string GalleryID { get; set; }

        public static explicit operator Video(VideoData source) {
            Video destination = new Video() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FilePath = source.FilePath,
                IndexDate = source.IndexDate,
                GalleryID = source.GalleryID
            };
            return destination;
        }

        public static explicit operator VideoData(Video source) {
            VideoData destination = new VideoData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FilePath = source.FilePath,
                IndexDate = source.IndexDate,
                GalleryID = source.GalleryID
            };
            return destination;
        }
    }
}
