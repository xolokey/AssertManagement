using AssetManagement.Data;
using AssetManagement.Models;
using Microsoft.EntityFrameworkCore;

public class EmployeeService : IEmployeeService
{
    private readonly EFCoreDbContext _context;

    public EmployeeService(EFCoreDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Employee>> GetAllAsync()
    {
        try
        {
            return await _context.Employees.ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Employee> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Employees.FindAsync(id);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Employee> CreateAsync(Employee employee)
    {
        try
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<Employee> UpdateAsync(int id, Employee employee)
    {
        try
        {
            var existing = await _context.Employees.FindAsync(id);
            if (existing == null) return null;

            existing.Name = employee.Name;
            existing.Email = employee.Email;
            existing.ContactNumber = employee.ContactNumber;
            existing.Address = employee.Address;
            existing.Gender = employee.Gender;
            existing.Role = employee.Role;

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
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return false;

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
