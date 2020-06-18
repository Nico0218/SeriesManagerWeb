﻿using MediaLibraryServer.Enums;

namespace MediaLibraryServer.Classes.LogicModels {
    public class User : LogicModelBase {
        public string Password { get; set; }
        public UserRoles Role { get; set; }
        public string Token { get; set; }
        public User() {

        }
    }
}
