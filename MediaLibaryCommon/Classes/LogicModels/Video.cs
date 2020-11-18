using System;
using System.IO;

namespace MediaLibraryCommon.Classes.LogicModels {
    public class Video : LogicModelBase, IFileItem {
        public string GalleryID { get; set; }
        public Video() {
        }

        public Video(string filePath, string name = null) : base(name) {
            if (string.IsNullOrEmpty(filePath)) throw new NullReferenceException("Video File Path");
            ID = Guid.NewGuid().ToString();
            DisplayName = Path.GetFileNameWithoutExtension(filePath);
            Name = DisplayName.Replace(' ', '_');
            FilePath = filePath;
            IndexDate = DateTime.Now;
        }

        public string FilePath { get; set; }
        public DateTime IndexDate { get; set; }
    }
}
