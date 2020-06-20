using System;

namespace MediaLibraryCommon.Classes.DataModels {
    public interface IFileItemData {
        string FilePath { get; set; }
        DateTime IndexDate { get; set; }
    }
}
