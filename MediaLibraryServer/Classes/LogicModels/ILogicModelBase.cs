using System.Configuration;

namespace MediaLibraryServer.Classes.LogicModels
{
    public interface ILogicModelBase
    {
        [StringValidator(MaxLength = 36)]
        string ID { get; set; }

        [StringValidator(MaxLength = 250)]
        string Name { get; set; }

        [StringValidator(MaxLength = 250)]
        string DisplayName { get; set; }
    }
}
