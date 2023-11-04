using MediaLibraryCommon.Classes.LogicModels;
using MediaLibraryCommon.Classes.Security;
using MediaLibraryServer.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Mysqlx.Session;
using System;

namespace MediaLibraryServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> logger;
        private readonly IUserService userService;

        public UserController(ILogger<UserController> logger, IUserService userService)
        {
            this.logger = logger;
            this.userService = userService;
        }

        [HttpPost("Login")]
        public IActionResult Login(LoginRequest loginRequest)
        {
            try
            {
                User user = userService.Login(loginRequest);
                if (user == null)
                {
                    //The login details could not be authenticated
                    return new UnauthorizedResult();
                }
                return new ObjectResult(user) { StatusCode = 201 };
            } catch (Exception ex)
            {
                //The login failed for an unexpected reason
                logger.LogError($"Login request failed - {HttpContext.Request.Host}", ex);
                return new UnauthorizedResult();
            }
        }

        [HttpPost("Logout")]
        public IActionResult Logout(LoginRequest loginRequest)
        {
            try
            {
                return new OkResult();
            } catch (Exception ex)
            {
                //The login failed for an unexpected reason
                logger.LogError($"Login request failed - {HttpContext.Request.Host}", ex);
                return new UnauthorizedResult();
            }
        }
    }
}
