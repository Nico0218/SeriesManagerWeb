using System;

namespace MediaLibraryCommon.Classes.LogicModels {
    public interface IFileItem {
        string FilePath { get; set; }
        DateTime IndexDate { get; set; }
    }
}
