using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace MediaLibraryServer.Services.Config {
    public class ConfigService : AbstractLibraryService<MainConfig, MainConfigData>, IConfigService {
        private static FileTypeSettings fileTypeSettings;
        private readonly IFolderService folderService;

        public ConfigService(ILogger<ConfigService> logger, IDataService dataService, IFolderService folderService) : base(logger, dataService) {
            fileTypeSettings = new FileTypeSettings();

            this.folderService = folderService;
        }

        /// <summary>
        /// Make sure that all the required config is set.
        /// </summary>
        /// <returns></returns>
        public bool IsConfigReady() {
            foreach (var item in Enum.GetValues(typeof(FolderType)).Cast<FolderType>()) {
                try {
                    folderService.GetFolder(item);
                } catch (Exception ex) {
                    logger.LogError("The library is not properly configured.", ex);
                    return false;
                }                    
            }
            return true;
        }

        public FileTypeSettings FileTypeSettings {
            get => fileTypeSettings; set => fileTypeSettings = value;
        }
    }
}
