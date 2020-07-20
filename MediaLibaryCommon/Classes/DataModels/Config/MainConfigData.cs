using MediaLibraryCommon.Classes.LogicModels.Config;

namespace MediaLibraryCommon.Classes.DataModels.Config {
    public class MainConfigData {
        public bool IsConfigured = false;

        public static explicit operator MainConfig(MainConfigData source) {
            MainConfig destination = new MainConfig() {
                IsConfigured = source.IsConfigured
            };
            return destination;
        }

        public static explicit operator MainConfigData(MainConfig source) {
            MainConfigData destination = new MainConfigData() {
                IsConfigured = source.IsConfigured
            };
            return destination;
        }
    }
}
