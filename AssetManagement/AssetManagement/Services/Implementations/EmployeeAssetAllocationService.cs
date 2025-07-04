using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services.Implementations
{
    public class EmployeeAssetAllocationService : IEmployeeAssetAllocationService
    {
        private readonly EFCoreDbContext _context;
        public EmployeeAssetAllocationService(EFCoreDbContext context) => _context = context;

        public async Task<IEnumerable<EmployeeAssetAllocation>> GetAllAsync()
            => await _context.EmployeeAssetAllocations
                   .Include(a => a.Employee)
                   .Include(a => a.Asset)
                   .ToListAsync();

        public async Task<EmployeeAssetAllocation?> GetByIdAsync(int id)
            => await _context.EmployeeAssetAllocations
                   .Include(a => a.Employee)
                   .Include(a => a.Asset)
                   .FirstOrDefaultAsync(a => a.AllocationID == id);

        public async Task<EmployeeAssetAllocation> CreateAsync(EmployeeAssetAllocation alloc)
        {
            _context.EmployeeAssetAllocations.Add(alloc);
            await _context.SaveChangesAsync();
            return alloc;
        }

        public async Task<EmployeeAssetAllocation?> UpdateAsync(int id, EmployeeAssetAllocation alloc)
        {
            var existing = await _context.EmployeeAssetAllocations.FindAsync(id);
            if (existing == null) return null;

            existing.EmployeeID = alloc.EmployeeID;
            existing.AssetID = alloc.AssetID;
            existing.AllocationDate = alloc.AllocationDate;
            existing.ReturnDate = alloc.ReturnDate;
            existing.Status = alloc.Status;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rec = await _context.EmployeeAssetAllocations.FindAsync(id);
            if (rec == null) return false;
            _context.EmployeeAssetAllocations.Remove(rec);
            await _context.SaveChangesAsync();
            return true;
        }

        /* ▶️ NEW: Approve or create allocation */
        public async Task<EmployeeAssetAllocation> ApproveAsync(int employeeId, int assetId)
        {
            var existing = await _context.EmployeeAssetAllocations
                .FirstOrDefaultAsync(a => a.EmployeeID == employeeId &&
                                          a.AssetID == assetId &&
                                          a.Status == "Requested");

            if (existing != null)
            {
                existing.Status = "Allocated";
                existing.AllocationDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return existing;
            }

            var alloc = new EmployeeAssetAllocation
            {
                EmployeeID = employeeId,
                AssetID = assetId,
                AllocationDate = DateTime.Now,
                Status = "Allocated"
            };
            _context.EmployeeAssetAllocations.Add(alloc);
            await _context.SaveChangesAsync();
            return alloc;
        }
    }
}
