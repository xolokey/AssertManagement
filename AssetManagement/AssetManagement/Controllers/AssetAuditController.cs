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
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // ───────────── GET by id ─────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // ───────────── POST single ─────────────
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssetAuditCreateDto dto)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
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
            try
            {
                var updated = await _service.UpdateAsync(id, audit);
                return updated == null ? NotFound() : Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // ───────────── DELETE ─────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);
                return deleted ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }


        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateAuditStatus(int id, [FromBody] string status)
        {
            try
            {
                var audit = await _context.AssetAudits.FindAsync(id);
                if (audit == null)
                    return NotFound();

                audit.Status = status;
                await _context.SaveChangesAsync();
                return NoContent(); // returns 204 No Content on success
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

    }
}
