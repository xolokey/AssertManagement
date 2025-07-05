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
            try
            {
                return await _context.AssetServiceRequests
                    .Include(r => r.Employee)
                    .Include(r => r.Asset)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetServiceRequest?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.AssetServiceRequests
                    .Include(r => r.Employee)
                    .Include(r => r.Asset)
                    .FirstOrDefaultAsync(r => r.ServiceRequestID == id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetServiceRequest> CreateAsync(AssetServiceRequest request)
        {
            try
            {
                _context.AssetServiceRequests.Add(request);
                await _context.SaveChangesAsync();
                return request;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetServiceRequest?> UpdateAsync(int id, AssetServiceRequest request)
        {
            try
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
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var existing = await _context.AssetServiceRequests.FindAsync(id);
                if (existing == null) return false;

                _context.AssetServiceRequests.Remove(existing);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
