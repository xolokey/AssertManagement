using AssetManagement.Data;
using AssetManagement.DTOs;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AssetAuditController : ControllerBase
    {
        private readonly IAssetAuditService _service;
        private readonly EFCoreDbContext _context;   // ✅ DbContext

        public AssetAuditController(IAssetAuditService service,
                                    EFCoreDbContext context)    // inject it
        {
            _service = service;
            _context = context;
        }

        // ───────────── GET all ─────────────
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var audits = await _service.GetAllAsync();

            var dtoList = audits.Select(a => new AssetAuditReadDto
            {
                AuditID = a.AuditID,
                AssetName = a.Asset?.AssetName ?? $"Asset {a.AssetID}",
                EmployeeName = a.Employee?.Name ?? $"Employee {a.EmployeeID}",
                RequestDate = a.RequestDate,
                Status = a.Status
            });

            return Ok(dtoList);
        }

        // ───────────── GET by id ─────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var audit = await _service.GetByIdAsync(id);
            if (audit == null) return NotFound();

            var dto = new AssetAuditReadDto
            {
                AuditID = audit.AuditID,
                AssetName = audit.Asset?.AssetName ?? $"Asset {audit.AssetID}",
                EmployeeName = audit.Employee?.Name ?? $"Employee {audit.EmployeeID}",
                RequestDate = audit.RequestDate,
                Status = audit.Status
            };

            return Ok(dto);
        }

        // ───────────── POST single ─────────────
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssetAuditCreateDto dto)
        {
            var audit = new AssetAudit
            {
                AssetID = dto.AssetID,
                EmployeeID = dto.EmployeeID,
                RequestDate = dto.RequestDate,
                Status = dto.Status
            };

            var created = await _service.CreateAsync(audit);
            return CreatedAtAction(nameof(GetById), new { id = created.AuditID }, created);
        }

        // ───────────── POST TriggerAll ─────────────
        [HttpPost("TriggerAll")]
        public async Task<IActionResult> TriggerAuditForAll()
        {
            try
            {
                var allocations = await _context.EmployeeAssetAllocations
                    .Include(ea => ea.Asset)
                    .Include(ea => ea.Employee)
                    .ToListAsync();

                var newAudits = allocations.Select(a => new AssetAudit
                {
                    EmployeeID = a.EmployeeID,
                    AssetID = a.AssetID,
                    RequestDate = DateTime.Now,
                    Status = "Pending"
                }).ToList();

                await _context.AssetAudits.AddRangeAsync(newAudits);
                await _context.SaveChangesAsync();

                return Ok($"{newAudits.Count} audit requests created.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // ───────────── PUT update ─────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssetAudit audit)
        {
            var updated = await _service.UpdateAsync(id, audit);
            return updated == null ? NotFound() : Ok(updated);
        }

        // ───────────── DELETE ─────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }


        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateAuditStatus(int id, [FromBody] string status)
        {
            var audit = await _context.AssetAudits.FindAsync(id);
            if (audit == null)
                return NotFound();

            audit.Status = status;
            await _context.SaveChangesAsync();
            return NoContent(); // returns 204 No Content on success
        }

    }
}
