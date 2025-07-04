using Microsoft.AspNetCore.Mvc;
using AssetManagement.Models;
using Microsoft.AspNetCore.Authorization;
using AssetManagement.DTOs;




[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IEmployeeService _employeeService;

    public EmployeeController(IEmployeeService employeeService)
    {
        _employeeService = employeeService;
    }

    // GET: api/Employee
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeReadDto>>> GetAll()
    {
        var employees = await _employeeService.GetAllAsync();

        var dtoList = employees.Select(e => new EmployeeReadDto
        {
            EmployeeID = e.EmployeeID,
            Name = e.Name,
            Email = e.Email,
            Role = e.Role
        });

        return Ok(dtoList);
    }

    // GET: api/Employee/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var emp = await _employeeService.GetByIdAsync(id);

        if (emp == null)
            return NotFound();

        var dto = new EmployeeReadDto
        {
            EmployeeID = emp.EmployeeID,
            Name = emp.Name,
            Email = emp.Email,
            Role = emp.Role
        };

        return Ok(dto);
    }

    // POST: api/Employee
    [HttpPost]
    public async Task<IActionResult> Create(EmployeeCreateDto dto)
    {
        var employee = new Employee
        {
            Name = dto.Name,
            Gender = dto.Gender,
            ContactNumber = dto.ContactNumber,
            Email = dto.Email,
            Address = dto.Address,
            PasswordHash = dto.Password, // Ideally hash before saving
            Role = dto.Role,
            DateCreated = DateTime.Now
        };

        await _employeeService.CreateAsync(employee);
        return Ok("Employee created");
    }

    // PUT: api/Employee/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Employee employee)
    {
        var updated = await _employeeService.UpdateAsync(id, employee);
        return updated == null ? NotFound() : Ok(updated);
    }

    // DELETE: api/Employee/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _employeeService.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }
}