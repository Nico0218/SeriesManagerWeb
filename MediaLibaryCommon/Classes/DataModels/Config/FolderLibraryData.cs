using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels.Config {
    public class FolderLibraryData : DataModelBase {
        public int FileType { get; set; }
        [StringValidator(MaxLength = 1000)]
        public string BasePath { get; set; }
        //Handled like a %
        public double MinFreeSpace { get; set; } = 5;

        public FolderLibraryData() {

        }

        public static explicit operator FolderLibrary(FolderLibraryData source) {
            FolderLibrary destination = new FolderLibrary() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                BasePath = source.BasePath,
                FileType = (FolderType)source.FileType,
                MinFreeSpace = source.MinFreeSpace
            };
            return destination;
        }

        public static explicit operator FolderLibraryData(FolderLibrary source) {
            FolderLibraryData destination = new FolderLibraryData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                BasePath = source.BasePath,
                FileType = (int)source.FileType,
                MinFreeSpace = source.MinFreeSpace
            };
            return destination;
        }
    }
}
