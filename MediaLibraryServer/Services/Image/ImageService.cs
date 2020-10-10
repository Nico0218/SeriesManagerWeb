using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;

namespace MediaLibraryServer.Services {
    public class ImageService : AbstractLibraryService<Image, ImageData>, IImageService {
        public ImageService(ILogger<ImageService> logger, IDataService dataService) : base(logger, dataService) {
        }

        public List<Image> GetAllImagesByGaleryID(string GalleryID) {
            if (GalleryID is null) {
                throw new ArgumentNullException(nameof(GalleryID));
            }

            logger.LogInformation($"Getting images for gallery {GalleryID}");
            List<ImageData> imageDatas = dataService.GetObjectData<ImageData>(null);
            List<Image> images = new List<Image>();
            foreach (var item in imageDatas) {
                images.Add((Image)item);
            }
            logger.LogInformation($"Returning {images.Count} images for gallery {GalleryID}");
            return images;
        }

        public string GetImageDataByID(string imageID) {
            if (imageID is null) {
                throw new ArgumentNullException(nameof(imageID));
            }
            logger.LogInformation($"Getting image data for ID {imageID}");
            Image image = GetByID(imageID);
            string base64Data = getImageDataByID(image);
            logger.LogInformation($"Returning image data for ID {imageID}");
            return base64Data;
        }

        private string getImageDataByID(Image image) {
            if (image is null) {
                throw new ArgumentNullException(nameof(image));
            }

            if (!File.Exists(image.FilePath)) {
                string message = $"Could not find file data for {image.DisplayName}";
                logger.LogError(message);
                throw new IOException(message);
            }

            return Convert.ToBase64String(File.ReadAllBytes(image.FilePath));
        }
    }
}
