using AssetManagement.Models;

namespace AssetManagement.Services.Interfaces
{
    public interface IAssetServiceRequestService
    {
        Task<IEnumerable<AssetServiceRequest>> GetAllAsync();
        Task<AssetServiceRequest?> GetByIdAsync(int id);
        Task<AssetServiceRequest> CreateAsync(AssetServiceRequest request);
        Task<AssetServiceRequest?> UpdateAsync(int id, AssetServiceRequest request);
        Task<bool> DeleteAsync(int id);
    }
}
