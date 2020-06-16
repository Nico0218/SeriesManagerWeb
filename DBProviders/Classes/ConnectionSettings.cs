using DBProviderBase.Interfaces;

namespace DBProviderBase.Classes {
    public class ConnectionSettings : IConnectionSettings {
        public ConnectionSettings() {

        }

        public string ConnectionString { get; set; }
        public string DBName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
