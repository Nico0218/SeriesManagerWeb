using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Enums;

namespace MediaLibraryCommon.Classes.DataModels {
    public class UserData: DataModelBase {
        public string Password { get; set; }
        public int Role { get; set; }

        public static explicit operator User(UserData source) {
            User destination = new User() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                Password = source.Password,
                Role = (UserRoles)source.Role
            };
            return destination;
        }

        public static explicit operator UserData(User source) {
            UserData destination = new UserData() {
                ID = source.ID,
                Name = source.Name,
                DisplayName = source.DisplayName,
                Password = source.Password,
                Role = (int)source.Role
            };
            return destination;
        }
    }
}
