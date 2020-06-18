using MediaLibraryServer.Classes.LogicModels;
using MediaLibraryServer.Classes.Security;
using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase {
        private readonly ILogger<UserController> logger;
        private readonly IUserService userService;

        public UserController(ILogger<UserController> logger, IUserService userService) {
            this.logger = logger;
            this.userService = userService;
        }

        [HttpPost("Authenticate")]
        public IActionResult Authenticate(LoginRequest loginRequest) {
            try {
                User user = userService.Login(loginRequest);
                if (user == null) {
                    //The login details could not be authenticated
                    return new UnauthorizedResult();
                }
                return new ObjectResult(user);
            } catch (Exception ex) {
                //The login failed for an unexpected reason
                logger.LogError($"Login request failed - {HttpContext.Request.Host}", ex);
                return new UnauthorizedResult();
            }            
        }
    }
}
