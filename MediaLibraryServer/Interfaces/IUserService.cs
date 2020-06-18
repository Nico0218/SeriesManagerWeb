using MediaLibraryServer.Classes.LogicModels;
using MediaLibraryServer.Classes.Security;

namespace MediaLibraryServer.Interfaces {
    public interface IUserService {
        User Login(LoginRequest loginRequest);
    }
}
