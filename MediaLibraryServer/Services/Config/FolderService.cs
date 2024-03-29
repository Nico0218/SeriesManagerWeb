﻿using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace MediaLibraryServer.Services.Config {
    public class FolderService : AbstractLibraryService<FolderLibrary, FolderLibraryData>, IFolderService {
        private static string AllFoldersKey = "AllFolders";

        public FolderService(ILogger<FolderService> logger, IDataService dataService, IMemoryCache memoryCache) : base(logger, dataService, memoryCache) {

        }

        /// <summary>
        /// Gets the first folder of the specific type with the specified amount of free space
        /// </summary>
        /// <param name="folderType">The type of folder to get.</param>
        /// <param name="fileSizeMb">The size of the file to be stored, defaults to 0 Mb</param>
        /// <returns></returns>
        public FolderLibrary GetFolder(FolderType folderType, long fileSizeMb = 0) {
            string key = AllFoldersKey + ":" + folderType.ToString();
            List<FolderLibrary> folders;
            if (!memoryCache.TryGetValue(key, out folders) || folders.Find(ii => ii.FileType == folderType) == null) {
                folders = GetAll().FindAll(ii => ii.FileType == folderType);
                MemoryCacheEntryOptions cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(2)).SetAbsoluteExpiration(TimeSpan.FromMinutes(5));
                memoryCache.Set(key, folders, cacheEntryOptions);
            }
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
