using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Security;

namespace MediaLibraryServer.Interfaces {
    public interface IUserService {
        User Login(LoginRequest loginRequest);
    }
}
