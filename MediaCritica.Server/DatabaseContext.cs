using MediaCritica.Server.Objects;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<AuthToken> AuthTokens { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Backlog> Backlogs { get; set; }
        public DbSet<Preference> Preferences { get; set; }
        public DbSet<Milestone> Milestones { get; set; }
        public DbSet<Engagement> Engagements { get; set; }
        public DbSet<UserFollow> UserFollows { get; set; }
        public DbSet<Notification> Notifications { get; set; }

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserFollow>()
                .HasOne(uf => uf.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(uf => uf.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserFollow>()
                .HasOne(uf => uf.Followed)
                .WithMany(u => u.Followers)
                .HasForeignKey(uf => uf.FollowedId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Author)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.AuthorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.RecipientId);

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.CreatedAt);
        }
    }
}
