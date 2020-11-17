using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Models;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;

namespace MediaLibraryServer.Services {
    public class ImageService : AbstractLibraryService<GalleryImage, ImageData>, IImageService {
        public ImageService(ILogger<ImageService> logger, IDataService dataService, IMemoryCache memoryCache) : base(logger, dataService, memoryCache) {
        }

        public List<GalleryImage> GetAllImagesByGaleryID(string GalleryID) {
            if (GalleryID is null) {
                throw new ArgumentNullException(nameof(GalleryID));
            }

            logger.LogInformation($"Getting images for gallery {GalleryID}");
            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "GalleryID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = GalleryID });
            List<ImageData> imageDatas = dataService.GetObjectData<ImageData>(parameters);
            List<GalleryImage> images = new List<GalleryImage>();
            foreach (var item in imageDatas) {
                images.Add((GalleryImage)item);
            }
            logger.LogInformation($"Returning {images.Count} images for gallery {GalleryID}");
            return images;
        }

        public List<GalleryImage> GetImagesByPage(string GalleryID, int pageNo, int pageSize = 10) {
            if (GalleryID is null) {
                throw new ArgumentNullException(nameof(GalleryID));
            }

            List<GalleryImage> images;
            string key = GalleryID + pageNo + pageSize;
            if (!memoryCache.TryGetValue(key, out images)) {
                logger.LogInformation($"Getting images for gallery {GalleryID}");
                List<IParameter> parameters = new List<IParameter>();
                parameters.Add(new Parameter() { ColumnName = "GalleryID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = GalleryID });
                //Need to build a proper paginated select from DB
                List<ImageData> imageDatas = dataService.GetObjectData<ImageData>(parameters);
                images = new List<GalleryImage>();
                pageNo--;
                if (imageDatas.Count > pageSize) {
                    int startIndex = pageSize * pageNo;
                    int range = imageDatas.Count - startIndex;
                    if (range > pageSize) {
                        range = pageSize;
                    }
                    foreach (var item in imageDatas.GetRange(startIndex, range)) {
                        images.Add((GalleryImage)item);
                    }
                } else {
                    foreach (var item in imageDatas) {
                        images.Add((GalleryImage)item);
                    }
                }

                AddItemToCache(key, images);
            }
            return images;
        }

        public ImageDataWrapper GetImageDataByID(string imageID) {
            if (imageID is null) {
                throw new ArgumentNullException(nameof(imageID));
            }
            logger.LogInformation($"Getting image data for ID {imageID}");
            GalleryImage image = GetByID(imageID);
            ImageDataWrapper imageDataWrapper = new ImageDataWrapper();
            imageDataWrapper.ImageData = Convert.ToBase64String(getImageDataByID(image));
            logger.LogInformation($"Returning image data for ID {imageID}");
            return imageDataWrapper;
        }

        public ImageDataWrapper GetImageThumbnailByID(string imageID, int ThumbnailSize = 256) {
            if (imageID is null) {
                throw new ArgumentNullException(nameof(imageID));
            }
            try {
                ImageDataWrapper imageDataWrapper;
                if (!memoryCache.TryGetValue(imageID, out imageDataWrapper)) {
                    GalleryImage galleryImage = GetByID(imageID);
                    using (Stream imageData = new MemoryStream(getImageDataByID(galleryImage))) {
                        Image image = Image.FromStream(imageData);
                        Image thumb = image.GetThumbnailImage(ThumbnailSize, ThumbnailSize, () => false, IntPtr.Zero);
                        using (MemoryStream m = new MemoryStream()) {
                            thumb.Save(m, image.RawFormat);
                            byte[] imageBytes = m.ToArray();

                            imageDataWrapper = new ImageDataWrapper();
                            // Convert byte[] to Base64 String
                            imageDataWrapper.ImageData = Convert.ToBase64String(imageBytes);
                        }
                    }
                    AddItemToCache(imageID, imageDataWrapper);
                }
                return imageDataWrapper;
            } catch (IOException ex) {
                throw ex;
            }
        }

        

        private byte[] getImageDataByID(GalleryImage image) {
            if (image is null) {
                throw new ArgumentNullException(nameof(image));
            }

            if (!File.Exists(image.FilePath)) {
                string message = $"Could not find file data for {image.DisplayName}";
                logger.LogError(message);
                throw new IOException(message);
            }

            return File.ReadAllBytes(image.FilePath);
        }
    }
}
