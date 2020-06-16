using System;

namespace MediaLibraryServer.Classes.DataModels {
    public interface IFileItemData {
        string FilePath { get; set; }
        DateTime IndexDate { get; set; }
    }
}
