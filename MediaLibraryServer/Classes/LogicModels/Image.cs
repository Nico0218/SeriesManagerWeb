using System;
using System.IO;

namespace MediaLibraryServer.Classes.LogicModels {
    public class Image : LogicModelBase, IFileItem {
        public string GalleryID { get; set; }
        public Image() : base() {
        }

        public Image(string filePath, string name = null) : base(name) {
            if (string.IsNullOrEmpty(filePath)) throw new NullReferenceException("Image File Path");
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
