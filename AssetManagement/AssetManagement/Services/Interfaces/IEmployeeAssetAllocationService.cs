using AssetManagement.Models;

namespace AssetManagement.Services.Interfaces
{
    public interface IEmployeeAssetAllocationService
    {
        Task<IEnumerable<EmployeeAssetAllocation>> GetAllAsync();
        Task<EmployeeAssetAllocation?> GetByIdAsync(int id);
        Task<EmployeeAssetAllocation> CreateAsync(EmployeeAssetAllocation allocation);
        Task<EmployeeAssetAllocation?> UpdateAsync(int id, EmployeeAssetAllocation allocation);
        Task<EmployeeAssetAllocation> ApproveAsync(int employeeId, int assetId);

        Task<bool> DeleteAsync(int id);
    }
}
