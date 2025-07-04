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
        return await _context.Employees.ToListAsync();
    }

    public async Task<Employee> GetByIdAsync(int id)
    {
        return await _context.Employees.FindAsync(id);
    }

    public async Task<Employee> CreateAsync(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    public async Task<Employee> UpdateAsync(int id, Employee employee)
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

    public async Task<bool> DeleteAsync(int id)
    {
        var emp = await _context.Employees.FindAsync(id);
        if (emp == null) return false;

        _context.Employees.Remove(emp);
        await _context.SaveChangesAsync();
        return true;
    }
}
