using Microsoft.EntityFrameworkCore;
using Footynet.Models;
using Footynet.Data.Seed;

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
    public DbSet<PlayerCareerEntry> PlayerCareerEntries { get; set; }

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

        modelBuilder.Entity<League>()
            .HasOne(l => l.County)
            .WithMany(c => c.Leagues)
            .HasForeignKey(l => l.CountyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PlayerCareerEntry>(e =>
        {
            e.Property(c => c.ClubName).HasMaxLength(100);
            e.HasOne(c => c.Player)
                .WithMany(p => p.CareerEntries)
                .HasForeignKey(c => c.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Club>().Property(c => c.Phone).HasMaxLength(30);

        modelBuilder.Entity<County>().HasData(LookupSeed.Counties);
        modelBuilder.Entity<League>().HasData(LookupSeed.Leagues);

        modelBuilder.Entity<User>().HasQueryFilter(u => u.IsActive);
        modelBuilder.Entity<JobAd>().HasQueryFilter(j => j.Club.IsActive);
    }
}