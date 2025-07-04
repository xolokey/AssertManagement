using Microsoft.EntityFrameworkCore;
using AssetManagement.Models;

namespace AssetManagement.Data
{
    public class EFCoreDbContext : DbContext
    {
       

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // This ensures SQL Server is only used if no options (e.g., in production)
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                     "Server=(localdb)\\mssqllocaldb;Database=AssertManagementDB;Trusted_Connection=True;MultipleActiveResultSets=true"
                );
            }
        }

        // Your DbSets
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetCategory> AssetCategories { get; set; }
        public DbSet<EmployeeAssetAllocation> EmployeeAssetAllocations { get; set; }
        public DbSet<AssetAudit> AssetAudits { get; set; }
        public DbSet<AssetServiceRequest> AssetServiceRequests { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }
    }
}
