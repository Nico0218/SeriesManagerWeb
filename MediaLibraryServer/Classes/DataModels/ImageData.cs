using MediaLibraryServer.Classes.LogicModels;
using System;
using System.Configuration;

namespace MediaLibraryServer.Classes.DataModels
{
    public class ImageData : DataModelBase, IFileItemData
    {
        [StringValidator(MaxLength = 1000)]
        public string FilePath { get; set; }
        public DateTime IndexDate { get; set; }
        [StringValidator(MaxLength = 36)]
        public string GalleryID { get; set; }

        public static explicit operator Image(ImageData source)
        {
            Image destination = new Image()
            {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FilePath = source.FilePath,
                IndexDate = source.IndexDate,
                GalleryID = source.GalleryID
            };
            return destination;
        }

        public static explicit operator ImageData(Image source)
        {
            ImageData destination = new ImageData()
            {
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
