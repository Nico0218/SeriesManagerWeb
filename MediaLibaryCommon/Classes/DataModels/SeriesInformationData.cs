using MediaLibraryCommon.Classes.LogicModels;
using System.Configuration;

namespace MediaLibraryCommon.Classes.DataModels {
    public class SeriesInformationData : DataModelBase {
        [StringValidator(MaxLength = 36)]
        public string WikiLink { get; set; }

        public SeriesInformationData() {

        }

        public static explicit operator SeriesInformation(SeriesInformationData source) {
            SeriesInformation destination = new SeriesInformation() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                WikiLink = source.WikiLink
            };
            return destination;
        }

        public static explicit operator SeriesInformationData(SeriesInformation source) {
            SeriesInformationData destination = new SeriesInformationData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                WikiLink = source.WikiLink
            };
            return destination;
        }
    }
}
