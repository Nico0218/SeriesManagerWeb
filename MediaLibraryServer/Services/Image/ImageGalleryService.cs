using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using ImageComparisonService.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Helpers;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class ImageGalleryService : AbstractLibraryService<Gallery, GalleryData>, IImageGalleryService {
        private readonly IConfigService configService;
        private readonly IImageService imageService;
        private readonly IImageComparisonService imageComparisonService;
        private readonly IFolderService folderService;

        public ImageGalleryService(ILogger<ImageGalleryService> logger, IDataService dataService, IConfigService configService, IImageService imageService, 
            IImageComparisonService imageComparisonService, IFolderService folderService, IMemoryCache memoryCache) : base(logger, dataService, memoryCache) {
            this.configService = configService;
            this.imageService = imageService;
            this.imageComparisonService = imageComparisonService;
            this.folderService = folderService;
        }

        public Gallery GetByName(string GalleryName) {
            if (GalleryName is null) {
                throw new ArgumentNullException(nameof(GalleryName));
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

        public void ProcessNewImageFile(string FilePath) {
            Gallery defaultGallery;
            defaultGallery = GetByName("Walls");
            if (defaultGallery == null) {
                defaultGallery = new Gallery("Walls");
                defaultGallery.Status = ObjectStatus.Created;
                Save(defaultGallery);
            }

            //Move the file
            string oldFilePath = FilePath;
            //Do a physical duplicate check
            string imgCompData = imageComparisonService.GetImageComparisonData(FilePath);
            if (imageComparisonService.isDuplicate(imgCompData)) {
                FilePath = Path.Combine(folderService.GetFolder(FolderType.ImageReject).BasePath, Path.GetFileName(FilePath));
                if (!Directory.Exists(Path.GetDirectoryName(FilePath))) {
                    Directory.CreateDirectory(Path.GetDirectoryName(FilePath));
                }
                File.Move(oldFilePath, FilePath, true);
                logger.LogInformation($"Found duplicate image {Path.GetFileName(oldFilePath)} and moved in to the rejected folder");
                return;
            }
            GalleryImage image = new GalleryImage(oldFilePath);
            FilePath = Path.Combine(folderService.GetFolder(FolderType.ImageFile).BasePath, image.Name);
            //Store in the file library
            int count = 0;
            while (FileUtils.IsFileLocked(FilePath)) {
                count++;
                string fileName = Path.GetFileName(FilePath);
                fileName = Path.GetFileName(fileName) + count + Path.GetExtension(fileName);
                image = new GalleryImage(FilePath.Replace(Path.GetFileName(FilePath), fileName));
                FilePath = Path.Combine(folderService.GetFolder(FolderType.ImageFile).BasePath, image.Name);
            }
            File.Move(oldFilePath, FilePath);

            image.FilePath = FilePath;
            //Index the file into the DB            
            image.ImageComparisonHash = imgCompData;
            image.GalleryID = defaultGallery.ID;
            image.Status = ObjectStatus.Created;
            imageService.Save(image);
        }
    }
}
