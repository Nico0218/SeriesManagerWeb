using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class ConfigController: ControllerBase {
        private readonly ILogger<ConfigController> logger;
        private readonly IConfigService configService;
        private readonly IFolderService folderService;

        public ConfigController(ILogger<ConfigController> logger, IConfigService configService, IFolderService folderService) {
            this.logger = logger;
            this.configService = configService;
            this.folderService = folderService;
        }

        [HttpGet("IsConfigured")]
        public ObjectResult IsConfigured() {
            //Check if we did first time setup
            if (!configService.IsConfigred)
                return new ObjectResult(false);
            //Check if the required config is still valid
            if (!configService.IsConfigReady())
                return new ObjectResult(false);
            return new ObjectResult(true);
        }

        [HttpGet("GetConfiguredFolders")]
        public ObjectResult GetConfiguredFolders() {
            return new ObjectResult(folderService.GetAll());
        }

        [HttpPost("SaveConfig")]
        public ObjectResult SaveConfig([FromBody] MainConfig mainConfig) {
            if (mainConfig is null) {
                Exception ex = new ArgumentNullException(nameof(mainConfig)); ;
                logger.LogError(ex.Message);
                throw ex;
            }

            logger.LogDebug($"Saving main configuration.");
            configService.Save(mainConfig);
            return new ObjectResult(true);
        }

        [HttpPost("SaveFolder")]
        public ObjectResult SaveFolder([FromBody]FolderLibrary folderLibrary) {
            if (folderLibrary is null) {
                Exception ex = new ArgumentNullException(nameof(folderLibrary)); ;
                logger.LogError(ex.Message);
                throw ex;
            }

            logger.LogDebug($"Saving folder library {folderLibrary.DisplayName}");
            folderService.Save(folderLibrary);
            return new ObjectResult(true);
        }
    }
}
