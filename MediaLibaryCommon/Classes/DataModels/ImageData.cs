using MediaLibraryCommon.Classes.LogicModels;
using System;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels
{
    public class ImageData : DataModelBase, IFileItemData
    {
        [StringValidator(MaxLength = 1000)]
        public string FilePath { get; set; }
        public DateTime IndexDate { get; set; }
        [StringValidator(MaxLength = 36)]
        public string GalleryID { get; set; }
        [StringValidator(MaxLength = 64)]
        public string ImageComparisonHash { get; set; }

        public static explicit operator GalleryImage(ImageData source)
        {
            GalleryImage destination = new GalleryImage()
            {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FilePath = source.FilePath,
                IndexDate = source.IndexDate,
                GalleryID = source.GalleryID,
                ImageComparisonHash = source.ImageComparisonHash
            };
            return destination;
        }

        public static explicit operator ImageData(GalleryImage source)
        {
            ImageData destination = new ImageData()
            {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                FilePath = source.FilePath,
                IndexDate = source.IndexDate,
                GalleryID = source.GalleryID,
                ImageComparisonHash = source.ImageComparisonHash
            };
            return destination;
        }
    }
}
