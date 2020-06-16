using System.Configuration;

namespace MediaLibraryServer.Classes.DataModels
{
    public abstract class DataModelBase: IDataModelBase
    {
        [StringValidator(MaxLength = 36)]
        public string ID { get; set; }

        [StringValidator(MaxLength = 250)]
        public string Name { get; set; }

        [StringValidator(MaxLength = 250)]
        public string DisplayName { get; set; }
    }
}
