using MediaLibraryCommon.Classes;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;

namespace MediaLibraryServer.Interfaces.Config {
    public interface IConfigService: IAbstractLibraryService<MainConfig, MainConfigData> {
        public FileTypeSettings FileTypeSettings { get; set; }
        public bool IsConfigReady();        
    }
}
