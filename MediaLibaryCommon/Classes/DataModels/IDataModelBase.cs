using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels
{
    public interface IDataModelBase
    {
        [StringValidator(MaxLength = 36)]
        string ID { get; set; }

        [StringValidator(MaxLength = 250)]
        string Name { get; set; }

        [StringValidator(MaxLength = 250)]
        string DisplayName { get; set; }
    }
}
