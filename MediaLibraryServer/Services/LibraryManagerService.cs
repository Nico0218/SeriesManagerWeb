using MediaLibraryCommon.Classes.DataModels;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryServer.Interfaces;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.Extensions.Logging;

namespace MediaLibraryServer.Services {
    public class LibraryManagerService : ILibraryManagerService {
        private readonly ILogger<LibraryManagerService> logger;
        private readonly IDataService dataService;
        private readonly IConfigService configService;

        public LibraryManagerService(ILogger<LibraryManagerService> logger, IDataService dataService, IConfigService configService) {
            logger.LogDebug("Starting LibraryManagerService");
            this.logger = logger;
            this.dataService = dataService;
            this.configService = configService;
            //Test DB connection
            dataService.TestConnection();
            //Ensure DB is in the correct state
            DBTableMaintenace();
            
            

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
