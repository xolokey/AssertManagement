using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services.Implementations
{
    public class AssetCategoryService : IAssetCategoryService
    {
        private readonly EFCoreDbContext _context;

        public AssetCategoryService(EFCoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AssetCategory>> GetAllAsync()
        {
            return await _context.AssetCategories.ToListAsync();
        }

        public async Task<AssetCategory> GetByIdAsync(int id)
        {
            return await _context.AssetCategories.FindAsync(id);
        }

        public async Task<AssetCategory> CreateAsync(AssetCategory category)
        {
            _context.AssetCategories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<AssetCategory?> UpdateAsync(int id, AssetCategory category)
        {
            var existing = await _context.AssetCategories.FindAsync(id);
            if (existing == null) return null;

            existing.CategoryName = category.CategoryName;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.AssetCategories.FindAsync(id);
            if (category == null) return false;

            _context.AssetCategories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
