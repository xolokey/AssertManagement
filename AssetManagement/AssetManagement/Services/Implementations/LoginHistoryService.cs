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
            return await _context.LoginHistories
                .Include(l => l.User)
                .ToListAsync();
        }

        public async Task<LoginHistory?> GetByIdAsync(int id)
        {
            return await _context.LoginHistories
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.LoginID == id);
        }

        public async Task<LoginHistory> CreateAsync(LoginHistory login)
        {
            _context.LoginHistories.Add(login);
            await _context.SaveChangesAsync();
            return login;
        }

        public async Task<LoginHistory?> UpdateAsync(int id, LoginHistory login)
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

        public async Task<bool> DeleteAsync(int id)
        {
            var login = await _context.LoginHistories.FindAsync(id);
            if (login == null) return false;

            _context.LoginHistories.Remove(login);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
