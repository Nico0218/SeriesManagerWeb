using MediaLibraryCommon.Enums;
using MediaLibraryServer.Helpers;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Timers;

namespace MediaLibraryServer.Services {
    public class FileProcessorService : IFileProcessorService, IDisposable {
        private readonly ILogger<FileProcessorService> logger;
        private readonly IConfigService configService;
        private readonly IVideoGalleryService videoGalleryService;
        private readonly IImageGalleryService imageGalleryService;
        private readonly IFolderService folderService;
        Timer fileWatcherTimer;

        public FileProcessorService(ILogger<FileProcessorService> logger, IConfigService configService, IVideoGalleryService videoGalleryService, IImageGalleryService imageGalleryService,
            IFolderService folderService) {
            this.logger = logger;
            this.configService = configService;
            this.videoGalleryService = videoGalleryService;
            this.imageGalleryService = imageGalleryService;
            this.folderService = folderService;

            fileWatcherTimer = new Timer(5000);
            fileWatcherTimer.Elapsed += FileWatcherTimer_Elapsed;
        }

        public void Dispose() {
            fileWatcherTimer.Dispose();
        }

        public void Start() {
            fileWatcherTimer.Start();
            logger.LogInformation("File processor service started.");
        }

        /// <summary>
        /// Checks if the files are in use and if not moves them to interim for processing
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FileWatcherTimer_Elapsed(object sender, ElapsedEventArgs e) {
            fileWatcherTimer.Enabled = false;

            try {
                if (configService.IsConfigReady()) {
                    logger.LogInformation("Checking for files in the ingest folder.");
                    FileUtils.CheckAndCreateDirectory(folderService.GetFolder(FolderType.Ingest).BasePath);
                    FileUtils.CheckAndCreateDirectory(folderService.GetFolder(FolderType.Interim).BasePath);

                    IEnumerable<string> enumerable = Directory.EnumerateFiles(folderService.GetFolder(FolderType.Ingest).BasePath, "*.*", SearchOption.AllDirectories);
                    int count = 0;
                    foreach (string filePath in enumerable) {
                        FileUtils.IsFileLocked(filePath);
                        string destPath = Path.Combine(folderService.GetFolder(FolderType.Interim).BasePath, Path.GetFileName(filePath));
                        bool fileMoved = false;
                        try {
                            File.Move(filePath, destPath);
                            fileMoved = true;
                        } catch (IOException ex) {
                            logger.LogError($"Failed to move the file {filePath} to the interim location", ex);
                        }
                        if (fileMoved)
                            ProcessFile(destPath);
                        count++;
                        if (count >= 100)
                            break;
                    }
                }
            } catch (Exception ex) {
                logger.LogError($"File process failed. {ex.Message}", ex);
            } finally {
                fileWatcherTimer.Enabled = true;
            }
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
                        try {
                            videoGalleryService.ProcessNewVideoFile(FilePath);
                        } catch (Exception ex) {
                            throw new Exception($"Failed to process video {Path.GetFileName(FilePath)} - {ex.Message}", ex);
                        }                        
                        break;
                    }
                case FolderType.ImageFile: {
                        try {
                            imageGalleryService.ProcessNewImageFile(FilePath);
                        } catch (Exception ex) {
                            throw new Exception($"Failed to process image {Path.GetFileName(FilePath)} - {ex.Message}", ex);
                        }
                        break;
                    }
                case FolderType.UnknownFile:
                default:
                    string rejectFile = Path.Combine(folderService.GetFolder(FolderType.UnknownFile).BasePath, Path.GetFileName(FilePath));
                    File.Move(FilePath, rejectFile);
                    break;
            }
        }
    }
}
