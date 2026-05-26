using Microsoft.EntityFrameworkCore;
using Footynet.Models;

namespace Footynet.Data;

public class FootynetDbContext : DbContext
{
    public FootynetDbContext(DbContextOptions<FootynetDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<Club> Clubs { get; set; }
    public DbSet<JobAd> JobAds { get; set; }
    public DbSet<JobApplication> JobApplications { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<County> Counties { get; set; }
    public DbSet<League> Leagues { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasDiscriminator<string>("UserType")
            .HasValue<Player>("Player")
            .HasValue<Club>("Club")
            .HasValue<Admin>("Admin");

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany()
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<JobApplication>()
            .HasIndex(ja => new { ja.PlayerId, ja.JobAdId })
            .IsUnique();

        modelBuilder.Entity<Player>(e =>
        {
            e.Property(p => p.CountyName).HasColumnName("County");
        });
        modelBuilder.Entity<Club>(e =>
        {
            e.Property(c => c.CountyName).HasColumnName("County");
        });

        modelBuilder.Entity<User>().HasQueryFilter(u => u.IsActive);
        modelBuilder.Entity<JobAd>().HasQueryFilter(j => j.Club.IsActive);
    }
}