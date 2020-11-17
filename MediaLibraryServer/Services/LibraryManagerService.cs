using DBProviderBase.Classes;
using DBProviderBase.Interfaces;
using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Services {
    public class LibraryManagerService : ILibraryManagerService {
        private readonly ILogger<LibraryManagerService> logger;
        private readonly IDataService dataService;

        public LibraryManagerService(ILogger<LibraryManagerService> logger, IDataService dataService, IFileProcessorService fileProcessorService) {
            logger.LogDebug("Starting LibraryManagerService");
            this.logger = logger;
            this.dataService = dataService;
            //Test DB connection
            dataService.TestConnection();
            //Ensure DB is in the correct state
            DBTableMaintenace();

            fileProcessorService.Start();
            logger.LogDebug("Started LibraryManagerService");
        }

        private void DBTableMaintenace() {
            logger.LogDebug("Running table maintenance.");
            dataService.CreatOrAlterObjectTable<MainConfigData>();
            dataService.CreatOrAlterObjectTable<FolderLibraryData>();
            dataService.CreatOrAlterObjectTable<SeriesInformationData>();
            dataService.CreatOrAlterObjectTable<VideoData>();
            dataService.CreatOrAlterObjectTable<GalleryData>();
            dataService.CreatOrAlterObjectTable<ImageData>();
            dataService.CreatOrAlterObjectTable<UserData>();
            logger.LogDebug("Completed table maintenance.");
        }
    }
}
