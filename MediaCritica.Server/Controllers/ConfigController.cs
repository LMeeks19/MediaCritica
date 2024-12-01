using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;

        public ConfigController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        [HttpGet(Name = "GetConfig")]
        [Route("[action]")]
        public async Task<ConfigModel> GetGonfig()
        {
            var configModel = new ConfigModel() { MEDIA_API_KEY = };
        }
}
