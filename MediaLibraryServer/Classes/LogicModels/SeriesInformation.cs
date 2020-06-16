using System;
using System.Configuration;

namespace MediaLibraryServer.Classes.LogicModels {
    public class SeriesInformation : LogicModelBase {
        [StringValidator(MaxLength = 36)]
        public string WikiLink { get; set; }

        public SeriesInformation() {

        }

        public SeriesInformation(string name) : base(name) {
        }

    }
}
