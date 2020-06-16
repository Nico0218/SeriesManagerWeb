using DBProviderBase.Classes;
using System.Collections.Generic;

namespace MediaLibraryServer.Interfaces
{
    public interface IDataService
    {
        void TestConnection();
        void CreatOrAlterObjectTable<T>();
        List<T> GetObjectData<T>(List<IParameter> parameters = null);
        void InsertObjectData<T>(T obj);
        void UpdateObjectData<T>(T obj);
        void DeleteObjectData<T>(T[] objects);
    }
}
