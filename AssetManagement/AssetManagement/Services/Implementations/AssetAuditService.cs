using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services.Implementations
{
    public class AssetAuditService : IAssetAuditService
    {
        private readonly EFCoreDbContext _context;

        public AssetAuditService(EFCoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AssetAudit>> GetAllAsync()
        {
            return await _context.AssetAudits
                .Include(a => a.Asset)
                .Include(a => a.Employee)
                .ToListAsync();
        }

        public async Task<AssetAudit?> GetByIdAsync(int id)
        {
            return await _context.AssetAudits
                .Include(a => a.Asset)
                .Include(a => a.Employee)
                .FirstOrDefaultAsync(a => a.AuditID == id);
        }

        public async Task<AssetAudit> CreateAsync(AssetAudit audit)
        {
            _context.AssetAudits.Add(audit);
            await _context.SaveChangesAsync();
            return audit;
        }

        public async Task<AssetAudit?> UpdateAsync(int id, AssetAudit audit)
        {
            var existing = await _context.AssetAudits.FindAsync(id);
            if (existing == null) return null;

            existing.EmployeeID = audit.EmployeeID;
            existing.AssetID = audit.AssetID;
            existing.RequestDate = audit.RequestDate;
            existing.Status = audit.Status;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var record = await _context.AssetAudits.FindAsync(id);
            if (record == null) return false;

            _context.AssetAudits.Remove(record);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
