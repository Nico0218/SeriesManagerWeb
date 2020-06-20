using System.Collections.Generic;

namespace MediaLibraryCommon.Classes
{
    public class LibrarySettings
    {
        public LibrarySettings()
        {
            VideoLibraryPaths = new List<string>();
            VideoLibraryPaths.Add(@"E:\TestVidLib");

        }

        public List<string> VideoLibraryPaths { get; set; }
    }
}
