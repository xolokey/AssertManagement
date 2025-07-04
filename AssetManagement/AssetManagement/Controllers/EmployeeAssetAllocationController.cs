using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetManagement.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeAssetAllocationController : ControllerBase
    {
        private readonly IEmployeeAssetAllocationService _service;
        private readonly IEmployeeService _employeeService;
        private readonly IAssetService _assetService;

        public EmployeeAssetAllocationController(
            IEmployeeAssetAllocationService service,
            IEmployeeService employeeService,
            IAssetService assetService)
        {
            _service = service;
            _employeeService = employeeService;
            _assetService = assetService;
        }

        // GET: api/EmployeeAssetAllocation
        // GET: api/EmployeeAssetAllocation
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var allocations = await _service.GetAllAsync();

            var dtoList = allocations.Select(a => new EmployeeAssetAllocationReadDto
            {
                AllocationID = a.AllocationID,

                /* ▶️  pass IDs so front‑end can filter */
                EmployeeID = a.EmployeeID,
                AssetID = a.AssetID,

                EmployeeName = a.Employee?.Name ?? $"Employee {a.EmployeeID}",
                AssetNo = a.Asset?.AssetNo ?? "",
                AssetName = a.Asset?.AssetName ?? $"Asset {a.AssetID}",
                AllocationDate = a.AllocationDate,
                ReturnDate = a.ReturnDate,
                Status = a.Status
            });

            return Ok(dtoList);
        }


        // GET: api/EmployeeAssetAllocation/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var a = await _service.GetByIdAsync(id);
            if (a == null) return NotFound();

            var dto = new EmployeeAssetAllocationReadDto
            {
                AllocationID = a.AllocationID,
                EmployeeID = a.EmployeeID,
                AssetID = a.AssetID,
                EmployeeName = a.Employee?.Name ?? $"Employee {a.EmployeeID}",
                AssetNo = a.Asset?.AssetNo ?? "",
                AssetName = a.Asset?.AssetName ?? $"Asset {a.AssetID}",
                AllocationDate = a.AllocationDate,
                ReturnDate = a.ReturnDate,
                Status = a.Status
            };

            return Ok(dto);
        }


        // POST: api/EmployeeAssetAllocation
        [HttpPost]
        public async Task<IActionResult> Create(EmployeeAssetAllocationCreateDto dto)
        {
            var allocation = new EmployeeAssetAllocation
            {
                EmployeeID = dto.EmployeeID,
                AssetID = dto.AssetID,
                AllocationDate = dto.AllocationDate,
                ReturnDate = dto.ReturnDate,
                Status = dto.Status
            };

            var created = await _service.CreateAsync(allocation);
            return CreatedAtAction(nameof(GetById), new { id = created.AllocationID }, created);
        }

        // PUT: api/EmployeeAssetAllocation/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmployeeAssetAllocation allocation)
        {
            var updated = await _service.UpdateAsync(id, allocation);
            return updated == null ? NotFound() : Ok(updated);
        }

        // PUT: api/EmployeeAssetAllocation/approve
        [Authorize(Roles = "Admin")]
        [HttpPut("approve")]
        public async Task<IActionResult> Approve([FromBody] AllocationApproveDto dto)
        {
            if (dto == null) return BadRequest("Payload required");

            var result = await _service.ApproveAsync(dto.EmployeeID, dto.AssetID);
            return Ok(result);
        }

        // DELETE: api/EmployeeAssetAllocation/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
