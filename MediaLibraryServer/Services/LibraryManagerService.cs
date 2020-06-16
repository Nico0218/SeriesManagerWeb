using MediaLibraryServer.Classes.DataModels;
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

            dataService.TestConnection();

            DBTableMaintenace();

            //string ID = Guid.NewGuid().ToString();
            //FolderLibraryData folderLibraryData = new FolderLibraryData()
            //{
            //    ID = ID,
            //    Name = "TestLib",
            //    DisplayName = "Test Lib",
            //    DirectoryPath = "E:/"
            //};
            //dataService.InsertObjectData(folderLibraryData);
            //folderLibraryData.Name = "Test Update";
            //dataService.UpdateObjectData(folderLibraryData);

            //List<FolderLibraryData> results = dataService.GetObjectData<FolderLibraryData>();
            //dataService.DeleteObjectData(results.ToArray());
            //FolderLibrary folderLibrary = (FolderLibrary)folderLibraryData;
            //logger.LogDebug(folderLibrary.Name);
            logger.LogDebug("Started LibraryManagerService");
        }

        private void DBTableMaintenace() {
            logger.LogDebug("Running table maintenance.");
            dataService.CreatOrAlterObjectTable<FolderLibraryData>();
            dataService.CreatOrAlterObjectTable<SeriesInformationData>();
            dataService.CreatOrAlterObjectTable<VideoData>();
            dataService.CreatOrAlterObjectTable<GalleryData>();
            dataService.CreatOrAlterObjectTable<ImageData>();
            logger.LogDebug("Completed table maintenance.");
        }
    }
}
