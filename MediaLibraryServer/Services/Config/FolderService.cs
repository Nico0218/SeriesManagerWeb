using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace MediaLibraryServer.Services.Config {
    public class FolderService : AbstractLibraryService<FolderLibrary, FolderLibraryData>, IFolderService {
        List<FolderLibrary> folderLibraries;

        public FolderService(ILogger<FolderService> logger, IDataService dataService) : base(logger, dataService) {
            folderLibraries = new List<FolderLibrary>();
            folderLibraries = GetAll();
            ensureBasicFolderObjects();
        }

        /// <summary>
        /// Gets the first folder of the specific type with the specified amount of free space
        /// </summary>
        /// <param name="folderType">The type of folder to get.</param>
        /// <param name="fileSizeMb">The size of the file to be stored, defaults to 0 Mb</param>
        /// <returns></returns>
        public FolderLibrary GetFolder(FolderType folderType, int fileSizeMb = 0) {
            List<FolderLibrary> folders = folderLibraries.FindAll(ii => ii.FileType == folderType);
            if (folders == null || folders.Count == 0) {
                throw new Exception($"No folders of type {folderType} configured.");
            }
            for (int i = 0; i < folders.Count; i++) {
                if (folders[i].IsReady() && folders[i].GetAvailableSpace > fileSizeMb) {
                    return folders[i];
                }
            }
            throw new Exception($"No {folderType} folder with free space available.");
        }

        private void ensureBasicFolderObjects() {
            string applicationRoot = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

            if (folderLibraries.Find(ii => ii.FileType.Equals(FolderType.Ingest)) == null) {
                FolderLibrary folderLibrary = new FolderLibrary("IngestFolder");
                folderLibrary.BasePath = Path.Combine(applicationRoot, "IngestFolder");
                folderLibrary.FileType = FolderType.Ingest;
                folderLibrary.Status = ObjectStatus.None;
                Save(folderLibrary);
                folderLibraries.Add(folderLibrary);
            }

            if (folderLibraries.Find(ii => ii.FileType.Equals(FolderType.Interim)) == null) {
                FolderLibrary folderLibrary = new FolderLibrary("InterimFolder");
                folderLibrary.BasePath = Path.Combine(applicationRoot, "InterimFolder");
                folderLibrary.FileType = FolderType.Interim;
                folderLibrary.Status = ObjectStatus.None;
                Save(folderLibrary);
                folderLibraries.Add(folderLibrary);
            }

            if (folderLibraries.Find(ii => ii.FileType.Equals(FolderType.ImageFile)) == null) {
                FolderLibrary folderLibrary = new FolderLibrary("ImageLibrary");
                folderLibrary.BasePath = Path.Combine(applicationRoot, "ImageLibrary");
                folderLibrary.FileType = FolderType.ImageFile;
                folderLibrary.Status = ObjectStatus.None;
                Save(folderLibrary);
                folderLibraries.Add(folderLibrary);
            }

            if (folderLibraries.Find(ii => ii.FileType.Equals(FolderType.VideoFile)) == null) {
                FolderLibrary folderLibrary = new FolderLibrary("VideoFolder");
                folderLibrary.BasePath = Path.Combine(applicationRoot, "VideoFolder");
                folderLibrary.FileType = FolderType.VideoFile;
                folderLibrary.Status = ObjectStatus.None;
                Save(folderLibrary);
                folderLibraries.Add(folderLibrary);
            }

            if (folderLibraries.Find(ii => ii.FileType.Equals(FolderType.UnknownFile)) == null) {
                FolderLibrary folderLibrary = new FolderLibrary("UnknownFolder");
                folderLibrary.BasePath = Path.Combine(applicationRoot, "UnknownFolder");
                folderLibrary.FileType = FolderType.UnknownFile;
                folderLibrary.Status = ObjectStatus.None;
                Save(folderLibrary);
                folderLibraries.Add(folderLibrary);
            }
            
        }
    }
}
