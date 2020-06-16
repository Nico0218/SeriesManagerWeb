namespace DBProviderBase.Interfaces {
    public interface IConnectionSettings {
        string ConnectionString { get; set; }
        string DBName { get; set; }
        string UserName { get; set; }
        string Password { get; set; }
    }
}
