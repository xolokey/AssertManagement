using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetManagement.DTOs;

namespace AssetManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AssetServiceRequestController : ControllerBase
    {
        private readonly IAssetServiceRequestService _service;

        public AssetServiceRequestController(IAssetServiceRequestService service)
        {
            _service = service;
        }

        // GET: api/AssetServiceRequest
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var requests = await _service.GetAllAsync();

            var dtoList = requests.Select(r => new AssetServiceRequestReadDto
            {
                ServiceRequestID = r.ServiceRequestID,
                EmployeeID = r.EmployeeID, 
                AssetID = r.AssetID,
                EmployeeName = r.Employee?.Name ?? $"Employee {r.EmployeeID}",
                AssetName = r.Asset?.AssetName ?? $"Asset {r.AssetID}",
                IssueType = r.IssueType,
                Description = r.Description,
                RequestDate = r.RequestDate,
                Status = r.Status
            });

            return Ok(dtoList);
        }

        // GET: api/AssetServiceRequest/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var r = await _service.GetByIdAsync(id);
            if (r == null) return NotFound();

            var dto = new AssetServiceRequestReadDto
            {
                ServiceRequestID = r.ServiceRequestID,
                EmployeeID = r.EmployeeID, 
                AssetID = r.AssetID,
                EmployeeName = r.Employee?.Name ?? $"Employee {r.EmployeeID}",
                AssetName = r.Asset?.AssetName ?? $"Asset {r.AssetID}",
                IssueType = r.IssueType,
                Description = r.Description,
                RequestDate = r.RequestDate,
                Status = r.Status
            };

            return Ok(dto);
        }

        // POST: api/AssetServiceRequest
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssetServiceRequestCreateDto dto)
        {
            var request = new AssetServiceRequest
            {
                EmployeeID = dto.EmployeeID,
                AssetID = dto.AssetID,
                IssueType = dto.IssueType,
                Description = dto.Description,
                RequestDate = dto.RequestDate,
                Status = dto.Status
            };

            var created = await _service.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.ServiceRequestID }, created);
        }

        // PUT: api/AssetServiceRequest/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssetServiceRequest request)
        {
            var updated = await _service.UpdateAsync(id, request);
            return updated == null ? NotFound() : Ok(updated);
        }

        // DELETE: api/AssetServiceRequest/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
