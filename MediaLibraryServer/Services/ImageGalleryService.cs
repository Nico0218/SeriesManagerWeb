using DBProviderBase.Classes;
using MediaLibraryServer.Classes.DataModels;
using MediaLibraryServer.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace MediaLibraryServer.Services {
    public class ImageGalleryService : IImageGalleryService {
        private readonly ILogger<ImageGalleryService> logger;
        private readonly IDataService dataService;

        public ImageGalleryService(ILogger<ImageGalleryService> logger, IDataService dataService) {
            this.logger = logger;
            this.dataService = dataService;
        }

        public List<Gallery> GetAllGalleries() {
            logger.LogInformation("Getting all galleries.");
            List<GalleryData> galleryDatas = dataService.GetObjectData<GalleryData>();
            List<Gallery> galleries = new List<Gallery>();
            foreach (var item in galleryDatas) {
                galleries.Add((Gallery)item);
            }
            logger.LogInformation($"Returning {galleries.Count} galleries.");
            return galleries;
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

        public Gallery GetGalleryByName(string GalleryName) {
            if (GalleryName is null) {
                throw new System.ArgumentNullException(nameof(GalleryName));
            }

            logger.LogInformation($"Getting gallery with name {GalleryName}");
            List<IParameter> paramerters = new List<IParameter>();
            paramerters.Add(new Parameter() {
                ColumnName = "Name",
                DataType = "System.String",
                Operator = DBProviderBase.Enums.ParamOperator.Equals,
                Value = GalleryName
            });
            GalleryData galleryData = dataService.GetObjectData<GalleryData>(paramerters).FirstOrDefault();
            if (galleryData != null) {
                logger.LogInformation($"Returning gallery with name {GalleryName}");
                return (Gallery)galleryData;
            } else {
                logger.LogInformation($"Could not find gallery with name {GalleryName}");
                return null;
            }
        }

        public Image GetImageByID(string imageID) {
            if (imageID is null) {
                throw new System.ArgumentNullException(nameof(imageID));
            }

            logger.LogInformation($"Getting image with ID {imageID}");
            List<IParameter> paramerters = new List<IParameter>();
            paramerters.Add(new Parameter() {
                ColumnName = "ID",
                DataType = "System.String",
                Operator = DBProviderBase.Enums.ParamOperator.Equals,
                Value = imageID
            });
            ImageData imageData = dataService.GetObjectData<ImageData>(paramerters).FirstOrDefault();
            if (imageData != null) {
                logger.LogInformation($"Returning image with ID {imageID}");
                return (Image)imageData;
            } else {
                logger.LogInformation($"Could not find image with ID {imageID}");
                return null;
            }
        }

        public string GetImageDataByID(string imageID) {
            if (imageID is null) {
                throw new ArgumentNullException(nameof(imageID));
            }
            logger.LogInformation($"Getting image data for ID {imageID}");
            Image image = GetImageByID(imageID);
            string base64Data = getImageDataByID(image);
            logger.LogInformation($"Returning image data for ID {imageID}");
            return base64Data;
        }

        public void SaveGallery(Gallery gallery) {
            if (gallery is null) {
                throw new System.ArgumentNullException(nameof(gallery));
            }
            logger.LogInformation($"Saving new gallery {gallery.DisplayName}");
            dataService.InsertObjectData((GalleryData)gallery);
        }

        public void SaveImage(Image image) {
            if (image is null) {
                throw new System.ArgumentNullException(nameof(image));
            }
            logger.LogInformation($"Saving new image {image.DisplayName}");
            dataService.InsertObjectData((ImageData)image);
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
