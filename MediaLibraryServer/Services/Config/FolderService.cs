using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace MediaLibraryServer.Services.Config {
    public class FolderService : AbstractLibraryService<FolderLibrary, FolderLibraryData>, IFolderService {
        
        public FolderService(ILogger<FolderService> logger, IDataService dataService) : base(logger, dataService) {            
            
        }

        /// <summary>
        /// Gets the first folder of the specific type with the specified amount of free space
        /// </summary>
        /// <param name="folderType">The type of folder to get.</param>
        /// <param name="fileSizeMb">The size of the file to be stored, defaults to 0 Mb</param>
        /// <returns></returns>
        public FolderLibrary GetFolder(FolderType folderType, int fileSizeMb = 0) {
            List<FolderLibrary> folders = GetAll().FindAll(ii => ii.FileType == folderType);
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
    }
}
