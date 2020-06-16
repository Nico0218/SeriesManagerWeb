using MediaLibraryServer.Interfaces;
using System.IO;

namespace MediaLibraryServer.Services {
    public class FolderIngestService: IIngestService
    {
        DirectoryInfo ingestDir = new DirectoryInfo("");
    }
}
