using System.Configuration;

namespace MediaLibraryServer.Classes.LogicModels
{
    public class FolderLibrary: LogicModelBase
    {
        [StringValidator(MaxLength = 1000)]
        public string DirectoryPath { get; set; }

        public FolderLibrary() {

        }

        public FolderLibrary(string name): base(name) {

        }
    }
}
