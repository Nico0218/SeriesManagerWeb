using MediaLibraryCommon.Classes;
using MediaLibraryServer.Interfaces;

namespace MediaLibraryServer.Services
{
    public class ConfigService : IConfigService
    {
        private static FileTypeSettings fileTypeSettings;
        private static IngestSettings ingestSettings;
        private static LibrarySettings librarySettings;

        public ConfigService()
        {
            fileTypeSettings = new FileTypeSettings();
            ingestSettings = new IngestSettings();
            librarySettings = new LibrarySettings();
        }

        public FileTypeSettings FileTypeSettings
        {
            get => fileTypeSettings; set => fileTypeSettings = value;
        }
        public IngestSettings IngestSettings
        {
            get => ingestSettings; set => ingestSettings = value;
        }
        public LibrarySettings LibrarySettings
        {
            get => librarySettings; set => librarySettings = value;
        }
    }
}
