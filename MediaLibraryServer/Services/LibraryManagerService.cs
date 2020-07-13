﻿using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Services {
    public class LibraryManagerService : ILibraryManagerService {
        private readonly ILogger<LibraryManagerService> logger;
        private readonly IDataService dataService;

        public LibraryManagerService(ILogger<LibraryManagerService> logger, IDataService dataService) {
            logger.LogDebug("Starting LibraryManagerService");
            this.logger = logger;
            this.dataService = dataService;
            //Test DB connection
            dataService.TestConnection();
            //Ensure DB is in the correct state
            DBTableMaintenace();
            //Load Libraries

            logger.LogDebug("Started LibraryManagerService");
        }

        private void DBTableMaintenace() {
            logger.LogDebug("Running table maintenance.");
            dataService.CreatOrAlterObjectTable<FolderLibraryData>();
            dataService.CreatOrAlterObjectTable<SeriesInformationData>();
            dataService.CreatOrAlterObjectTable<VideoData>();
            dataService.CreatOrAlterObjectTable<GalleryData>();
            dataService.CreatOrAlterObjectTable<ImageData>();
            dataService.CreatOrAlterObjectTable<UserData>();
            logger.LogDebug("Completed table maintenance.");
        }

        public void GetAllLibraries() { 
        }

        public void LoadLibrary() { 
        }

        public void SaveLibrary() { 

        }
    }
}
