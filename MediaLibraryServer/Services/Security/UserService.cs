using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Security;
using MediaLibraryServer.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace MediaLibraryServer.Services {
    public class UserService : IUserService {
        private readonly ILogger<UserService> logger;

        private List<User> testUsers;

        public UserService(ILogger<UserService> logger) {
            this.logger = logger;
            testUsers = new List<User>();
            testUsers.Add(new User() {
                ID = Guid.NewGuid().ToString(),
                Name = "admin",
                DisplayName = "admin",
                Password = "admin",
                Role = MediaLibraryCommon.Enums.UserRoles.Admin,
                Token = "AdminTokenString"
            });
            testUsers.Add(new User() {
                ID = Guid.NewGuid().ToString(),
                Name = "standard",
                DisplayName = "standard",
                Password = "standard",
                Role = MediaLibraryCommon.Enums.UserRoles.Standard,
                Token = "StandardTokenString"
            });
        }

        public User Login(LoginRequest loginRequest) {
            if (loginRequest is null) {
                throw new ArgumentNullException(nameof(loginRequest));
            }

            if (string.IsNullOrEmpty(loginRequest.UserName)) {
                throw new ArgumentException("No user name was provided.", nameof(loginRequest.UserName));
            }
            logger.LogInformation($"Attempting login for {loginRequest.UserName}");

            if (string.IsNullOrEmpty(loginRequest.Password)) {
                throw new ArgumentException("No password has been provided.", nameof(loginRequest.Password));
            }

            return testUsers.Find(ii => ii.DisplayName.Equals(loginRequest.UserName, StringComparison.OrdinalIgnoreCase) && ii.Password.Equals(loginRequest.Password));
        }
    }
}
