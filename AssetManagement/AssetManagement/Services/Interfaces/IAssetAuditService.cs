using AssetManagement.Models;

namespace AssetManagement.Services.Interfaces
{
    public interface IAssetAuditService
    {
        Task<IEnumerable<AssetAudit>> GetAllAsync();
        Task<AssetAudit?> GetByIdAsync(int id);
        Task<AssetAudit> CreateAsync(AssetAudit audit);
        Task<AssetAudit?> UpdateAsync(int id, AssetAudit audit);
        Task<bool> DeleteAsync(int id);
    }
}
