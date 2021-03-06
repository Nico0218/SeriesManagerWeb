﻿using System;
using System.IO;

namespace MediaLibraryCommon.Classes.LogicModels {
    public class GalleryImage : LogicModelBase, IFileItem {
        public string GalleryID { get; set; }
        public GalleryImage() : base() {
        }

        public GalleryImage(string filePath, string name = null) : base(name) {
            if (string.IsNullOrEmpty(filePath)) throw new NullReferenceException("Image File Path");
            ID = Guid.NewGuid().ToString();
            DisplayName = Path.GetFileNameWithoutExtension(filePath);
            Name = Path.GetFileName(filePath).Replace(' ', '_');
            FilePath = filePath;
            IndexDate = DateTime.Now;
        }

        public string FilePath { get; set; }
        public DateTime IndexDate { get; set; }
        public string ImageComparisonHash { get; set; }
    }
}
