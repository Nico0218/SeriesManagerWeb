using MediaLibraryCommon.Classes.LogicModels;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels
{
    public class FolderLibraryData : DataModelBase
    {
        [StringValidator(MaxLength = 1000)]
        public string DirectoryPath { get; set; }

        public FolderLibraryData()
        {

        }

        public static explicit operator FolderLibrary(FolderLibraryData source)
        {
            FolderLibrary destination = new FolderLibrary() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                DirectoryPath = source.DirectoryPath
            };
            return destination;
        }

        public static explicit operator FolderLibraryData(FolderLibrary source)
        {
            FolderLibraryData destination = new FolderLibraryData()
            {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                DirectoryPath = source.DirectoryPath
            };
            return destination;
        }
    }
}
