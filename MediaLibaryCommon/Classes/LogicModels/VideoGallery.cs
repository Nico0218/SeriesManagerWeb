using MediaLibraryCommon.Enums;
using System.Configuration;

namespace MediaLibraryCommon.Classes.LogicModels {
    public class VideoGallery : LogicModelBase {
        [StringValidator(MaxLength = 1000)]
        public string Description { get; set; } = "No description has been added.";

        [StringValidator(MaxLength = 250)]
        public string WikiLink { get; set; }

        public int Rating { get; set; } = 0;

        public int EpisodeCount { get; set; } = 0;

        public AiringState AiringState { get; set; } = AiringState.Unknown;

        public VideoGallery() {

        }

        public VideoGallery(string name) : base(name) {
        }

    }
}
