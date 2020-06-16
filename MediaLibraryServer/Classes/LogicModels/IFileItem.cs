using System;

namespace MediaLibraryServer.Classes.LogicModels {
    public interface IFileItem {
        string FilePath { get; set; }
        DateTime IndexDate { get; set; }
    }
}
