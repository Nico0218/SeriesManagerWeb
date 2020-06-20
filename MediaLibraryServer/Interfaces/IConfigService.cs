using MediaLibraryCommon.Classes;

namespace MediaLibraryServer.Interfaces
{
    public interface IConfigService
    {
        public IngestSettings IngestSettings { get; set; }
        public FileTypeSettings FileTypeSettings { get; set; }

        public LibrarySettings LibrarySettings { get; set; }
    }
}
