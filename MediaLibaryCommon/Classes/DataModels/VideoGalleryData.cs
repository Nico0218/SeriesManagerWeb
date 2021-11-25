using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Enums;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels {
    public class VideoGalleryData : DataModelBase {
        [StringValidator(MaxLength = 1000)]
        public string Description { get; set; }

        [StringValidator(MaxLength = 250)]
        public string WikiLink { get; set; }

        public int Rating { get; set; }

        public int EpisodeCount { get; set; }

        public int AiringState { get; set; }

        public VideoGalleryData() {

        }

        public static explicit operator VideoGallery(VideoGalleryData source) {
            VideoGallery destination = new VideoGallery() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                Description = source.Description,
                WikiLink = source.WikiLink,
                Rating = source.Rating,
                EpisodeCount = source.EpisodeCount,
                AiringState = (AiringState)source.AiringState
            };
            return destination;
        }

        public static explicit operator VideoGalleryData(VideoGallery source) {
            VideoGalleryData destination = new VideoGalleryData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                Description = source.Description,
                WikiLink = source.WikiLink,
                Rating = source.Rating,
                EpisodeCount = source.EpisodeCount,
                AiringState = (int)source.AiringState
            };
            return destination;
        }
    }
}
