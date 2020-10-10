using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace MediaLibraryServer.Services.Config {
    public class ConfigService : AbstractLibraryService<MainConfig, MainConfigData>, IConfigService {
        private static FileTypeSettings fileTypeSettings;
        private static IngestSettings ingestSettings;
        private static LibrarySettings librarySettings;
        private readonly IFolderService folderService;

        public ConfigService(ILogger<ConfigService> logger, IDataService dataService, IFolderService folderService) : base(logger, dataService) {
            fileTypeSettings = new FileTypeSettings();
            ingestSettings = new IngestSettings();
            librarySettings = new LibrarySettings();

            this.folderService = folderService;
        }

        public bool IsConfigred {
            get {
                MainConfig mainConfig = GetAll()?.FirstOrDefault();
                if (mainConfig != null)
                    return mainConfig.IsConfigured;
                return false;
            }
        }

        /// <summary>
        /// Make sure that all the required config is set.
        /// </summary>
        /// <returns></returns>
        public bool IsConfigReady() {
            if (folderService.GetFolder(FolderType.Ingest) == null)
                return false;
            if (folderService.GetFolder(FolderType.Interim) == null)
                return false;
            if (folderService.GetFolder(FolderType.VideoFile) == null)
                return false;
            if (folderService.GetFolder(FolderType.ImageFile) == null)
                return false;
            return true;
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
