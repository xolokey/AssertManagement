using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Services.Implementations
{
    public class LoginHistoryService : ILoginHistoryService
    {
        private readonly EFCoreDbContext _context;

        public LoginHistoryService(EFCoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LoginHistory>> GetAllAsync()
        {
            try
            {
                return await _context.LoginHistories
                    .Include(l => l.User)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoginHistory?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.LoginHistories
                    .Include(l => l.User)
                    .FirstOrDefaultAsync(l => l.LoginID == id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoginHistory> CreateAsync(LoginHistory login)
        {
            try
            {
                _context.LoginHistories.Add(login);
                await _context.SaveChangesAsync();
                return login;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoginHistory?> UpdateAsync(int id, LoginHistory login)
        {
            try
            {
                var existing = await _context.LoginHistories.FindAsync(id);
                if (existing == null) return null;

                existing.UserID = login.UserID;
                existing.LoginTime = login.LoginTime;
                existing.LogoutTime = login.LogoutTime;
                existing.JWTToken = login.JWTToken;

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
                var login = await _context.LoginHistories.FindAsync(id);
                if (login == null) return false;

                _context.LoginHistories.Remove(login);
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
