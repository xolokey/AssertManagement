using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services.Implementations
{
    public class AssetServiceRequestService : IAssetServiceRequestService
    {
        private readonly EFCoreDbContext _context;

        public AssetServiceRequestService(EFCoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AssetServiceRequest>> GetAllAsync()
        {
            return await _context.AssetServiceRequests
                .Include(r => r.Employee)
                .Include(r => r.Asset)
                .ToListAsync();
        }

        public async Task<AssetServiceRequest?> GetByIdAsync(int id)
        {
            return await _context.AssetServiceRequests
                .Include(r => r.Employee)
                .Include(r => r.Asset)
                .FirstOrDefaultAsync(r => r.ServiceRequestID == id);
        }

        public async Task<AssetServiceRequest> CreateAsync(AssetServiceRequest request)
        {
            _context.AssetServiceRequests.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<AssetServiceRequest?> UpdateAsync(int id, AssetServiceRequest request)
        {
            var existing = await _context.AssetServiceRequests.FindAsync(id);
            if (existing == null) return null;

            existing.EmployeeID = request.EmployeeID;
            existing.AssetID = request.AssetID;
            existing.IssueType = request.IssueType;
            existing.Description = request.Description;
            existing.RequestDate = request.RequestDate;
            existing.Status = request.Status;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.AssetServiceRequests.FindAsync(id);
            if (existing == null) return false;

            _context.AssetServiceRequests.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
