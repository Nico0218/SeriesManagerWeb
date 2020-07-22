using MediaLibraryCommon.Enums;
using MediaLibraryServer.Helpers;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Timers;

namespace MediaLibraryServer.Services {
    public class FileProcessorService : IFileProcessorService, IDisposable {
        private readonly ILogger<FileProcessorService> logger;
        private readonly IConfigService configService;
        private readonly IVideoGalleryService videoGalleryService;
        private readonly IImageGalleryService imageGalleryService;
        
        Timer fileWatcherTimer;
        
        public FileProcessorService(ILogger<FileProcessorService> logger, IConfigService configService, IVideoGalleryService videoGalleryService, IImageGalleryService imageGalleryService) {
            this.logger = logger;
            this.configService = configService;
            this.videoGalleryService = videoGalleryService;
            this.imageGalleryService = imageGalleryService;
            logger.LogInformation("Starting file processor service.");
            
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
            fileWatcherTimer.Enabled = false;
            string[] filePaths = Directory.GetFiles(configService.IngestSettings.IngestFolderPath, "*.*");
            foreach (string filePath in filePaths) {
                FileUtils.IsFileLocked(filePath);
                string destPath = Path.Combine(configService.IngestSettings.InterimFolderPath, Path.GetFileName(filePath));
                bool fileMoved = false;
                try {
                    File.Move(filePath, destPath);
                    fileMoved = true;
                } catch (IOException ex) {
                    logger.LogError($"Failed to move the file {filePath} to the interim location", ex);
                }
                if (fileMoved)
                    ProcessFile(destPath);
            }
            fileWatcherTimer.Enabled = true;
        }

        private void ProcessFile(string FilePath) {
            //Get File Type
            string fileExtension = Path.GetExtension(FilePath);
            FolderType fileType = FolderType.UnknownFile;
            if (configService.FileTypeSettings.GetVideoFileTypes().Contains(fileExtension)) {
                fileType = FolderType.VideoFile;
            } else if (configService.FileTypeSettings.GetImageFileTypes().Contains(fileExtension)) {
                fileType = FolderType.ImageFile;
            }

            //Sanitize file
            try {
                string fileName = Path.GetFileName(FilePath);
                fileName = FileUtils.NameFix(fileName, configService.FileTypeSettings.GetRemoveStrings());
                string oldFilePath = FilePath;
                FilePath = Path.Combine(Path.GetDirectoryName(oldFilePath), fileName + fileExtension);
                File.Move(oldFilePath, FilePath, true);
            } catch (IOException ex) {
                logger.LogError($"Failed to sanitize file {Path.GetFileName(FilePath)}", ex);
            }
            switch (fileType) {
                case FolderType.VideoFile: {
                        videoGalleryService.ProcessNewVideoFile(FilePath);
                        break;
                    }
                case FolderType.ImageFile: {
                        imageGalleryService.ProcessNewImageFile(FilePath);
                        break;
                    }
                case FolderType.UnknownFile:
                default:
                    string rejectFile = Path.Combine(configService.IngestSettings.RejectedPath, Path.GetFileName(FilePath));
                    File.Move(FilePath, rejectFile);
                    break;
            }
        }
    }
}
