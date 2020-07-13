using DBProviderBase.Classes;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class ImageGalleryService : AbstractLibraryService<Gallery, GalleryData>, IImageGalleryService {
        public ImageGalleryService(ILogger<ImageGalleryService> logger, IDataService dataService) : base(logger, dataService) {
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
    }
}
