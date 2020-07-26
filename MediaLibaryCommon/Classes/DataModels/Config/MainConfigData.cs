using MediaLibraryCommon.Classes.LogicModels.Config;

namespace MediaLibraryCommon.Classes.DataModels.Config {
    public class MainConfigData : DataModelBase {
        public bool IsConfigured { get; set; } = false;

        public static explicit operator MainConfig(MainConfigData source) {
            MainConfig destination = new MainConfig() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                IsConfigured = source.IsConfigured
            };
            return destination;
        }

        public static explicit operator MainConfigData(MainConfig source) {
            MainConfigData destination = new MainConfigData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                IsConfigured = source.IsConfigured
            };
            return destination;
        }
    }
}
