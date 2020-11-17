using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces {
    public interface IAbstractLibraryService<TObject, TDataObject> {
        List<TObject> GetAll();
        TObject GetByID(string ID);
        public void Save(TObject logicObject);
    }
}
