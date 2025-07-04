using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services.Implementations
{
    public class AssetService : IAssetService
    {
        private readonly EFCoreDbContext _context;

        public AssetService(EFCoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Asset>> GetAllWithCategoryAsync()
        {
            return await _context.Assets
                .Include(a => a.AssetCategory)
                .ToListAsync();
        }

        public async Task<IEnumerable<Asset>> GetAllAsync()
        {
            return await _context.Assets.Include(a => a.AssetCategory).ToListAsync();
        }

        public async Task<Asset?> GetByIdAsync(int id)
        {
            return await _context.Assets.Include(a => a.AssetCategory)
                                        .FirstOrDefaultAsync(a => a.AssetID == id);
        }

        public async Task<Asset> CreateAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task<Asset?> UpdateAsync(int id, Asset asset)
        {
            var existing = await _context.Assets.FindAsync(id);
            if (existing == null) return null;

            existing.AssetNo = asset.AssetNo;
            existing.AssetName = asset.AssetName;
            existing.AssetModel = asset.AssetModel;
            existing.ManufacturingDate = asset.ManufacturingDate;
            existing.ExpiryDate = asset.ExpiryDate;
            existing.AssetValue = asset.AssetValue;
            existing.AssetStatus = asset.AssetStatus;
            existing.ImageURL = asset.ImageURL;
            existing.AssetCategoryID = asset.AssetCategoryID;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return false;

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
