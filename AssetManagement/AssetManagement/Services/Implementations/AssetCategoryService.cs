﻿using AssetManagement.Data;
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
            try
            {
                return await _context.AssetCategories.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetCategory> GetByIdAsync(int id)
        {
            try
            {
                return await _context.AssetCategories.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetCategory> CreateAsync(AssetCategory category)
        {
            try
            {
                _context.AssetCategories.Add(category);
                await _context.SaveChangesAsync();
                return category;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetCategory?> UpdateAsync(int id, AssetCategory category)
        {
            try
            {
                var existing = await _context.AssetCategories.FindAsync(id);
                if (existing == null) return null;

                existing.CategoryName = category.CategoryName;
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
                var category = await _context.AssetCategories.FindAsync(id);
                if (category == null) return false;

                _context.AssetCategories.Remove(category);
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
