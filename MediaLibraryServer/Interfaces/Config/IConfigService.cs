using MediaLibraryCommon.Classes;
using MediaLibraryCommon.Classes.DataModels.Config;
using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryCommon.Enums;

namespace MediaLibraryServer.Interfaces.Config {
    public interface IConfigService: IAbstractLibraryService<MainConfig, MainConfigData> {
        public IngestSettings IngestSettings { get; set; }
        public FileTypeSettings FileTypeSettings { get; set; }
        public LibrarySettings LibrarySettings { get; set; }
        public bool IsConfigred { get; }
        public bool IsConfigReady();        
    }
}
