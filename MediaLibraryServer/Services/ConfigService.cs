using MediaLibraryCommon.Classes;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class ConfigService : IConfigService {
        private static FileTypeSettings fileTypeSettings;
        private static IngestSettings ingestSettings;
        private static LibrarySettings librarySettings;
        private readonly IDataService dataService;
        MainConfig mainConfig;
        List<FolderLibrary> folderLibraries;

        public ConfigService(IDataService dataService) {
            fileTypeSettings = new FileTypeSettings();
            ingestSettings = new IngestSettings();
            librarySettings = new LibrarySettings();

            this.dataService = dataService;

            mainConfig = (MainConfig)this.dataService.GetObjectData<MainConfigData>()?.FirstOrDefault();
            folderLibraries = new List<FolderLibrary>();
            List<FolderLibraryData> folderLibraryDatas = this.dataService.GetObjectData<FolderLibraryData>();
            foreach (var folderLibraryData in folderLibraryDatas) {
                folderLibraries.Add((FolderLibrary)folderLibraryData);
            }
        }

        public bool IsConfigred { get { return mainConfig.IsConfigured; } }

        public FolderLibrary IngestFolder {
            get {
                FolderLibrary folder = folderLibraries.Find(ii => ii.FileType == FolderType.Ingest);
                if (folder == null) {
                    throw new Exception("Ingest folder is not configured.");
                }
                return folder;
            }
            set {
                int index = folderLibraries.FindIndex(ii => ii.FileType == FolderType.Ingest);
                if (index == -1) {
                    folderLibraries.Add(value);
                } else {
                    folderLibraries[index] = value;
                }
            }
        }

        public FolderLibrary InterimFolder {
            get {
                FolderLibrary folder = folderLibraries.Find(ii => ii.FileType == FolderType.Interim);
                if (folder == null) {
                    throw new Exception("Interim folder is not configured.");
                }
                return folder;
            }
            set {
                int index = folderLibraries.FindIndex(ii => ii.FileType == FolderType.Interim);
                if (index == -1) {
                    folderLibraries.Add(value);
                } else {
                    folderLibraries[index] = value;
                }
            }
        }

        public FileTypeSettings FileTypeSettings {
            get => fileTypeSettings; set => fileTypeSettings = value;
        }
        public IngestSettings IngestSettings {
            get => ingestSettings; set => ingestSettings = value;
        }
        public LibrarySettings LibrarySettings {
            get => librarySettings; set => librarySettings = value;
        }
    }
}
