using AssetManagement.Models;

namespace AssetManagement.Services.Interfaces
{
    public interface IAssetCategoryService
    {
        Task<IEnumerable<AssetCategory>> GetAllAsync();
        Task<AssetCategory> GetByIdAsync(int id);
        Task<AssetCategory> CreateAsync(AssetCategory category);
        Task<AssetCategory?> UpdateAsync(int id, AssetCategory category);
        Task<bool> DeleteAsync(int id);
    }
}
