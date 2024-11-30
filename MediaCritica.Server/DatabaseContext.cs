using MediaCritica.Server.Objects;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DatabaseContext(DbContextOptions options) : base(options) { }
    }
}
