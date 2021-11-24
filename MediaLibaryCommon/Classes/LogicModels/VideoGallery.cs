using System.Configuration;

namespace MediaLibraryCommon.Classes.LogicModels {
    public class VideoGallery : LogicModelBase {
        [StringValidator(MaxLength = 1000)]
        public string Description { get; set; }

        [StringValidator(MaxLength = 36)]
        public string WikiLink { get; set; }

        public VideoGallery() {

        }

        public VideoGallery(string name) : base(name) {
        }

    }
}
