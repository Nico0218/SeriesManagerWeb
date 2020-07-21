using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;

namespace MediaLibraryServer.Interfaces.Config {
    public interface IFolderService: IAbstractLibraryService<FolderLibrary, FolderLibraryData> {
        public FolderLibrary GetFolder(FolderType folderType, int fileSizeMb = 0);
    }
}
