namespace MediaLibraryServer.Classes.LogicModels {
    public class Gallery : LogicModelBase {
        public Gallery() {

        }

        public Gallery(string name) : base(name) {

        }
        //This needs to be reworked into a proper file store
        public string FileStore { get; set; }
    }
}
