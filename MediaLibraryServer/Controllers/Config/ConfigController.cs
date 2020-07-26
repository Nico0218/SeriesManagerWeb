using MediaLibraryCommon.Classes.LogicModels.Config;
using MediaLibraryServer.Interfaces.Config;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MediaLibraryServer.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class ConfigController : ControllerBase {
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

        [HttpGet("GetFolders")]
        public ObjectResult GetFolders() {
            return new ObjectResult(folderService.GetAll());
        }

        [HttpGet("GetConfig")]
        public ObjectResult GetConfig() {
            logger.LogDebug("Getting main config");
            return new ObjectResult(configService.GetAll().FirstOrDefault());
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

        [HttpPost("SaveFolders")]
        public ObjectResult SaveFolder([FromBody] List<FolderLibrary> folderLibraries) {
            if (folderLibraries is null) {
                Exception ex = new ArgumentNullException(nameof(folderLibraries)); ;
                logger.LogError(ex.Message);
                throw ex;
            }

            logger.LogDebug($"Saving {folderLibraries.Count} folders.");
            foreach (var folderLibrary in folderLibraries) {
                folderService.Save(folderLibrary);
            }            
            return new ObjectResult(true);
        }
    }
}
