using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
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
using System.Text.RegularExpressions;
using System.Threading;
using VideoProcessorService.Interfaces;

namespace MediaLibraryServer.Services {
    public class VideoGalleryService : AbstractLibraryService<VideoGallery, VideoGalleryData>, IVideoGalleryService {
        private readonly IConfigService configService;
        private readonly IVideoService videoService;
        private readonly IFolderService folderService;
        private readonly IVideoConversionService videoConversionService;
        private readonly string constSeasonString = "Season";
        Regex SeasonandNoSpaceMatch;
        Regex SeasonandSpaceMatch;
        Regex SandNoSpaceMatch;
        Regex SandSpaceMatch;

        private readonly char[] numbers = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

        public VideoGalleryService(ILogger<VideoGalleryService> logger, IDataService dataService, IVideoService videoService, IFolderService folderService, IMemoryCache memoryCache,
            IVideoConversionService videoConversionService) : base(logger, dataService, memoryCache) {
            SeasonandNoSpaceMatch = new Regex(@"(Season[0-9]+)", RegexOptions.IgnoreCase);
            SeasonandSpaceMatch = new Regex(@"(Season [0-9]+)", RegexOptions.IgnoreCase);
            SandNoSpaceMatch = new Regex(@"(S[0-9]+)", RegexOptions.IgnoreCase);
            SandSpaceMatch = new Regex(@"(S [0-9]+)", RegexOptions.IgnoreCase);
            this.videoService = videoService;
            this.folderService = folderService;
            this.videoConversionService = videoConversionService;
        }

        public VideoGallery GetByName(string galleryName) {
            if (galleryName is null) {
                throw new ArgumentNullException(nameof(galleryName));
            }
            logger.LogDebug($"Getting video gallery {galleryName}");

            List<IParameter> parameters = new List<IParameter>();

            parameters.Add(new Parameter() { ColumnName = "Name", DataType = "System.String", Operator = DBProviderBase.Enums.ParamOperator.Equals, Value = galleryName.Replace(" ", "").Trim() });
            VideoGalleryData videoGalleryDatas = dataService.GetObjectData<VideoGalleryData>(parameters).FirstOrDefault();
            if (videoGalleryDatas == null) {
                logger.LogDebug($"Could not find video gallery {galleryName}");
                return null;
            }
            logger.LogDebug($"Returning video gallery {galleryName}");
            return (VideoGallery)videoGalleryDatas;
        }

        public async void ProcessNewVideoFile(string filePath) {
            FileInfo fileInfo = new FileInfo(filePath);
            long fileSize = Convert.ToInt64(Math.Ceiling(Convert.ToDouble(fileInfo.Length) / 1024 / 1024));
            //Decide which lib the file goes to
            string libPath = folderService.GetFolder(FolderType.VideoFile, fileSize).BasePath;
            //Decide the video gallery folder name
            string fileName = Path.GetFileName(filePath);
            int index = fileName.LastIndexOfAny(numbers);
            while (numbers.Contains(fileName[index - 1])) {
                index--;
            }
            string videoGallerName = fileName.Substring(0, index).Trim();

            string season;
            Match regexMatch = SeasonandNoSpaceMatch.Match(fileName);
            if (regexMatch.Success) {
                season = regexMatch.Value.Replace("season", constSeasonString + " ", StringComparison.InvariantCultureIgnoreCase);
            } else {
                regexMatch = SeasonandSpaceMatch.Match(fileName);
                if (regexMatch.Success) {
                    season = regexMatch.Value.Replace("season", constSeasonString, StringComparison.InvariantCultureIgnoreCase);
                } else {
                    regexMatch = SandNoSpaceMatch.Match(fileName);
                    if (regexMatch.Success) {
                        season = regexMatch.Value.Replace("season", constSeasonString, StringComparison.InvariantCultureIgnoreCase);
                    } else {
                        regexMatch = SandSpaceMatch.Match(fileName);
                        if (regexMatch.Success) {
                            season = regexMatch.Value.Replace("season", constSeasonString, StringComparison.InvariantCultureIgnoreCase);
                        } else {
                            season = constSeasonString + " 1";
                        }
                    }
                }
            }

            //Create the season entry
            VideoGallery videoGallery = GetByName(videoGallerName);
            if (videoGallery == null) {
                videoGallery = new VideoGallery(videoGallerName);
                videoGallery.Status = ObjectStatus.Created;
                Save(videoGallery);
            }

            //Create the season folder directory
            string oldFilePath = filePath;
            filePath = Path.Combine(libPath, videoGallerName, season, Path.GetFileNameWithoutExtension(filePath));
            if (!Directory.Exists(Path.GetDirectoryName(filePath))) {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            }

            //Duplicate check
            if (File.Exists(filePath + ".mp4")) {
                filePath = Path.Combine(folderService.GetFolder(FolderType.VideoReject).BasePath, Path.GetFileName(oldFilePath));
                File.Move(oldFilePath, filePath, true);
                logger.LogInformation($"Found duplicate video {Path.GetFileName(filePath)} and moved in to the rejected folder");
                return;
            }

            //Convert the video and Move the file to the library
            string resultFile = await videoConversionService.ConvertVideoAsync(oldFilePath, filePath, false);
            //Index the file in the DB
            Video episode = new Video(resultFile);
            episode.GalleryID = videoGallery.ID;
            episode.Status = ObjectStatus.Created;
            videoService.Save(episode);
            try {
                if (FileUtils.IsFileLocked(oldFilePath)) {
                    Thread.Sleep(500);
                    File.Delete(oldFilePath);
                } else {
                    File.Delete(oldFilePath);
                }
            } catch (Exception ex) {
                logger.LogError("Failed to cleanup old video file.", ex);
            }
        }
    }
}
