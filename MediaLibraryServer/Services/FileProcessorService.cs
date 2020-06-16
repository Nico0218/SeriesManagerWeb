using MediaLibraryServer.Classes.LogicModels;
using MediaLibraryServer.Enums;
using MediaLibraryServer.Helpers;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Timers;

namespace MediaLibraryServer.Services {
    public class FileProcessorService : IFileProcessorService, IDisposable {
        private readonly ILogger<FileProcessorService> logger;
        private readonly IConfigService configService;
        private readonly IVideoLibraryService videoLibraryService;
        private readonly IImageGalleryService imageLibraryService;
        private readonly string constSeasonString = "Season";
        Timer fileWatcherTimer;
        Regex SeasonandNoSpaceMatch;
        Regex SeasonandSpaceMatch;
        Regex SandNoSpaceMatch;
        Regex SandSpaceMatch;

        private char[] numbers = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

        public FileProcessorService(ILogger<FileProcessorService> logger, IConfigService configService, IVideoLibraryService videoLibraryService, IImageGalleryService imageLibraryService) {
            this.logger = logger;
            this.configService = configService;
            this.videoLibraryService = videoLibraryService;
            this.imageLibraryService = imageLibraryService;
            logger.LogInformation("Starting file processor service.");
            SeasonandNoSpaceMatch = new Regex(@"(Season[0-9]+)", RegexOptions.IgnoreCase);
            SeasonandSpaceMatch = new Regex(@"(Season [0-9]+)", RegexOptions.IgnoreCase);
            SandNoSpaceMatch = new Regex(@"(S[0-9]+)", RegexOptions.IgnoreCase);
            SandSpaceMatch = new Regex(@"(S [0-9]+)", RegexOptions.IgnoreCase);
            FileUtils.CheckAndCreateDirectory(configService.IngestSettings.IngestFolderPath);
            FileUtils.CheckAndCreateDirectory(configService.IngestSettings.InterimFolderPath);

            fileWatcherTimer = new Timer(configService.IngestSettings.timerInterval);
            fileWatcherTimer.Elapsed += FileWatcherTimer_Elapsed;
            fileWatcherTimer.Start();

            logger.LogInformation("File processor service started.");

            FileWatcherTimer_Elapsed(null, null);
        }

        public void Dispose() {
            fileWatcherTimer.Dispose();
        }

        /// <summary>
        /// Checks if the files are in use and if not moves them to interim for processing
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FileWatcherTimer_Elapsed(object sender, ElapsedEventArgs e) {
            string[] filePaths = Directory.GetFiles(configService.IngestSettings.IngestFolderPath, "*.*");
            foreach (string filePath in filePaths) {
                FileUtils.IsFileLocked(filePath);
                string destPath = Path.Combine(configService.IngestSettings.InterimFolderPath, Path.GetFileName(filePath));
                try {
                    File.Move(filePath, destPath);
                    ProcessFile(destPath);
                } catch (IOException ex) {
                    logger.LogError($"Failed to move the file {filePath} to the interim location", ex);
                }
            }
        }

        private void ProcessFile(string FilePath) {
            //Get File Type
            string fileExtension = Path.GetExtension(FilePath);
            FileType fileType = FileType.UnknownFile;
            if (configService.FileTypeSettings.GetVideoFileTypes().Contains(fileExtension)) {
                fileType = FileType.VideoFile;
            } else if (configService.FileTypeSettings.GetImageFileTypes().Contains(fileExtension)) {
                fileType = FileType.ImageFile;
            }

            //Sanitize file
            try {
                string fileName = Path.GetFileName(FilePath);
                fileName = FileUtils.NameFix(fileName, configService.FileTypeSettings.GetRemoveStrings());
                string oldFilePath = FilePath;
                FilePath = Path.Combine(Path.GetDirectoryName(oldFilePath), fileName + fileExtension);
                File.Move(oldFilePath, FilePath);
            } catch (IOException ex) {
                logger.LogError($"Failed to sanitize file {Path.GetFileName(FilePath)}", ex);
            }
            switch (fileType) {
                case FileType.VideoFile: {
                        ProcessVideoFile(FilePath);
                        break;
                    }
                case FileType.ImageFile: {
                        ProcessImageFile(FilePath);
                        break;
                    }
                case FileType.UnknownFile:
                default:
                    break;
            }
        }

        private void ProcessVideoFile(string FilePath) {
            //Decide which lib the file goes to
            string libPath = configService.LibrarySettings.VideoLibraryPaths[0];
            //Decide the series folder name
            string fileName = Path.GetFileName(FilePath);
            int index = fileName.LastIndexOfAny(numbers);
            while (numbers.Contains(fileName[index - 1])) {
                index--;
            }
            string SeriesName = fileName.Substring(0, index).Trim();

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
            SeriesInformation seriesInformation = videoLibraryService.GetSeriesByName(SeriesName);
            if (seriesInformation == null) {
                seriesInformation = new SeriesInformation(SeriesName);
                videoLibraryService.SaveSeries(seriesInformation);
            }

            //Move the file to the library
            string oldFilePath = FilePath;
            FilePath = Path.Combine(libPath, SeriesName, season, Path.GetFileName(FilePath));
            if (!Directory.Exists(Path.GetDirectoryName(FilePath))) {
                Directory.CreateDirectory(Path.GetDirectoryName(FilePath));
            }
            File.Move(oldFilePath, FilePath);
            //Index the file in the DB
            Video episode = new Video(FilePath);
            episode.SeriesID = seriesInformation.ID;
            videoLibraryService.SaveEpisode(episode);
        }

        private void ProcessImageFile(string FilePath) {
            Gallery defaultGallery;
            defaultGallery = imageLibraryService.GetGalleryByName("Walls");
            if (defaultGallery == null) {
                defaultGallery = new Gallery("Walls");
                defaultGallery.FileStore = @"E:\TestImgLib";
                imageLibraryService.SaveGallery(defaultGallery);
            }

            //Move the file
            string oldFilePath = FilePath;
            FilePath = Path.Combine(defaultGallery.FileStore, Path.GetFileName(FilePath));
            File.Move(oldFilePath, FilePath);
            //Index the file into the DB
            Image image = new Image(FilePath);
            image.GalleryID = defaultGallery.ID;
            imageLibraryService.SaveImage(image);
        }
    }
}
