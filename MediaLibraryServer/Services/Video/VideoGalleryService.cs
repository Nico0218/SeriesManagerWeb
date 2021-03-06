﻿using DBProviderBase.Classes;
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

namespace MediaLibraryServer.Services {
    public class VideoGalleryService : AbstractLibraryService<VideoGallery, VideoGalleryData>, IVideoGalleryService {
        private readonly IConfigService configService;
        private readonly IVideoService videoService;
        private readonly IFolderService folderService;
        private readonly string constSeasonString = "Season";
        Regex SeasonandNoSpaceMatch;
        Regex SeasonandSpaceMatch;
        Regex SandNoSpaceMatch;
        Regex SandSpaceMatch;

        private readonly char[] numbers = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

        public VideoGalleryService(ILogger<VideoGalleryService> logger, IDataService dataService, IVideoService videoService, IFolderService folderService, IMemoryCache memoryCache) : base(logger, dataService, memoryCache) {
            SeasonandNoSpaceMatch = new Regex(@"(Season[0-9]+)", RegexOptions.IgnoreCase);
            SeasonandSpaceMatch = new Regex(@"(Season [0-9]+)", RegexOptions.IgnoreCase);
            SandNoSpaceMatch = new Regex(@"(S[0-9]+)", RegexOptions.IgnoreCase);
            SandSpaceMatch = new Regex(@"(S [0-9]+)", RegexOptions.IgnoreCase);
            this.videoService = videoService;
            this.folderService = folderService;
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

        public void ProcessNewVideoFile(string filePath) {
            //Decide which lib the file goes to
            string libPath = folderService.GetFolder(FolderType.VideoFile).BasePath;
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

            //Move the file to the library
            string oldFilePath = filePath;
            filePath = Path.Combine(libPath, videoGallerName, season, Path.GetFileName(filePath));
            if (!Directory.Exists(Path.GetDirectoryName(filePath))) {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            }
            //Duplicate check
            if (!FileUtils.IsFileLocked(filePath)) {
                File.Move(oldFilePath, filePath);
                //Index the file in the DB
                Video episode = new Video(filePath);
                episode.GalleryID = videoGallery.ID;
                episode.Status = ObjectStatus.Created;
                videoService.Save(episode);
            } else {
                filePath = Path.Combine(folderService.GetFolder(FolderType.VideoReject).BasePath, Path.GetFileName(filePath));
                File.Move(oldFilePath, filePath, true);
                logger.LogInformation($"Found duplicate video {Path.GetFileName(filePath)} and moved in to the rejected folder");
            }
        }
    }
}
