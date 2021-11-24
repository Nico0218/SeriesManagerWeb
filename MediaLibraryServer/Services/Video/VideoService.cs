using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class VideoService : AbstractLibraryService<Video, VideoData>, IVideoService {
        public VideoService(ILogger<VideoService> logger, IDataService dataService, IMemoryCache memoryCache) : base(logger, dataService, memoryCache) {

        }

        public List<Video> GetByGallery(string galleryID) {
            if (galleryID is null) {
                throw new ArgumentNullException(nameof(galleryID));
            }
            logger.LogDebug($"Getting videos for gallery {galleryID}");

            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "GalleryID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = galleryID });
            List<VideoData> videoDatas = dataService.GetObjectData<VideoData>(parameters);
            List<Video> videos = new List<Video>();
            foreach (var item in videoDatas) {
                videos.Add((Video)item);
            }
            logger.LogDebug($"Returning {videos.Count} videos for gallery {galleryID}");
            return videos;
        }

        public int GetCountByGallery(string galleryID) {
            if (string.IsNullOrEmpty(galleryID)) {
                throw new NullReferenceException(galleryID);
            }
            List<IParameter> parameters = new List<IParameter>();
            parameters.Add(new Parameter() { ColumnName = "GalleryID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = galleryID });
            return dataService.GetObjectData<VideoData>(parameters).Count;
        }

        public List<Video> GetByPage(string galleryID, int pageNo, int pageSize = 10) {
            if (string.IsNullOrEmpty(galleryID)) {
                throw new NullReferenceException(galleryID);
            }

            List<Video> videos;
            string key = galleryID + pageNo + pageSize;
            if (!memoryCache.TryGetValue(key, out videos)) {
                logger.LogInformation($"Getting images for gallery {galleryID}");
                List<IParameter> parameters = new List<IParameter>();
                parameters.Add(new Parameter() { ColumnName = "GalleryID", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = galleryID });
                //Need to build a proper paginated select from DB
                List<VideoData> videoDatas = dataService.GetObjectData<VideoData>(parameters);
                videos = new List<Video>();
                pageNo--;
                if (videoDatas.Count > pageSize) {
                    int startIndex = pageSize * pageNo;
                    int range = videoDatas.Count - startIndex;
                    if (range > pageSize) {
                        range = pageSize;
                    }
                    foreach (var item in videoDatas.GetRange(startIndex, range)) {
                        videos.Add((Video)item);
                    }
                } else {
                    foreach (var item in videoDatas) {
                        videos.Add((Video)item);
                    }
                }
                videos = videos.OrderBy(ii => ii.Name).ToList();
                AddItemToCache(key, videos);
            }
            return videos;
        }
    }
}
