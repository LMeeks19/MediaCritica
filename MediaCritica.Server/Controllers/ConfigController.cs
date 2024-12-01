using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet(Name = "GetConfig")]
        [Route("[action]")]
        public ConfigModel GetConfig()
        {
            return new ConfigModel() { MediaServiceApiKey = _configuration["Media:ServiceApiKey"]! };
        }
    }
}
