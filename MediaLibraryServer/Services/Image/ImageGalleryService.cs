﻿using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using ImageComparisonService.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Helpers;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Interfaces.Config;
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

        public ImageGalleryService(ILogger<ImageGalleryService> logger, IDataService dataService, IConfigService configService, IImageService imageService, IImageComparisonService imageComparisonService) : base(logger, dataService) {
            this.configService = configService;
            this.imageService = imageService;
            this.imageComparisonService = imageComparisonService;
        }

        public Gallery GetGalleryByName(string GalleryName) {
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
            defaultGallery = GetGalleryByName("Walls");
            if (defaultGallery == null) {
                defaultGallery = new Gallery("Walls");
                defaultGallery.FileStore = @"E:\TestImgLib";
                Save(defaultGallery);
            }

            //Move the file
            string oldFilePath = FilePath;
            //Do a physical duplicate check
            string imgCompData = imageComparisonService.GetImageComparisonData(FilePath);
            if (imageComparisonService.isDuplicate(imgCompData)) {
                FilePath = Path.Combine(configService.IngestSettings.RejectedPath, "Image", Path.GetFileName(FilePath));
                if (!Directory.Exists(Path.GetDirectoryName(FilePath))) {
                    Directory.CreateDirectory(Path.GetDirectoryName(FilePath));
                }
                File.Move(oldFilePath, FilePath, true);
                logger.LogInformation($"Found duplicate image {Path.GetFileName(FilePath)} and moved in to the rejected folder");
                return;
            }
            Image image = new Image(oldFilePath);
            FilePath = Path.Combine(defaultGallery.FileStore, image.Name);
            //Store in the file library
            int count = 0;
            while (FileUtils.IsFileLocked(FilePath)) {
                count++;
                string fileName = Path.GetFileName(FilePath);
                fileName = Path.GetFileName(fileName) + count + Path.GetExtension(fileName);
                image = new Image(FilePath.Replace(Path.GetFileName(FilePath), fileName));
                FilePath = Path.Combine(defaultGallery.FileStore, image.Name);
            }
            File.Move(oldFilePath, FilePath);

            image.FilePath = FilePath;
            //Index the file into the DB            
            image.ImageComparisonHash = imgCompData;
            image.GalleryID = defaultGallery.ID;
            imageService.Save(image);
        }
    }
}
