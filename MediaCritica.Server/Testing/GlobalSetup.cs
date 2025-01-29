using Microsoft.EntityFrameworkCore;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing
{
    [Binding]
    public class GlobalSetup
    {
        private static DbContextOptions<DatabaseContext> _options;
        public static DatabaseContext _dbContext;

        [BeforeTestRun]
        public static async Task BeforeTestRun()
        {
            // Creates the in-memory database options once before all tests run
            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _dbContext = new DatabaseContext(_options);
        }

        // Clean up the database after all tests are done
        [AfterTestRun]
        public static async Task AfterTestRun()
        {
            await _dbContext.Database.EnsureDeletedAsync(); // Remove in-memory database
        }
    }
}
