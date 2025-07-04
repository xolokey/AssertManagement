using AssetManagement.Models;

namespace AssetManagement.Services.Interfaces
{
    public interface ILoginHistoryService
    {
        Task<IEnumerable<LoginHistory>> GetAllAsync();
        Task<LoginHistory?> GetByIdAsync(int id);
        Task<LoginHistory> CreateAsync(LoginHistory login);
        Task<LoginHistory?> UpdateAsync(int id, LoginHistory login);
        Task<bool> DeleteAsync(int id);
    }
}
