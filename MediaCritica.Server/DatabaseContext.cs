using MediaCritica.Server.Objects;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Backlog> Backlogs { get; set; }
        public DbSet<Preference> Preferences { get; set; }
        public DbSet<Milestone> Milestones { get; set; }

        public DbSet<Media> Media { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Episode> Episodes { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        public DatabaseContext(DbContextOptions options) : base(options)
        {
        }

    }
}
