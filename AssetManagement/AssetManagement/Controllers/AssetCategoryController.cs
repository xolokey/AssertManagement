using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetManagement.DTOs;

namespace AssetManagement.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AssetCategoryController : ControllerBase
    {
        private readonly IAssetCategoryService _service;

        public AssetCategoryController(IAssetCategoryService service)
        {
            _service = service;
        }

        // GET: api/AssetCategory
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AssetCategoryReadDto>>> GetAll()
        {
            var categories = await _service.GetAllAsync();
            var dtoList = categories.Select(c => new AssetCategoryReadDto
            {
                AssetCategoryID = c.AssetCategoryID,
                CategoryName = c.CategoryName
            });

            return Ok(dtoList);
        }

        // GET: api/AssetCategory/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var cat = await _service.GetByIdAsync(id);
            if (cat == null) return NotFound();

            var dto = new AssetCategoryReadDto
            {
                AssetCategoryID = cat.AssetCategoryID,
                CategoryName = cat.CategoryName
            };

            return Ok(dto);
        }

        // POST: api/AssetCategory
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(AssetCategoryCreateDto dto)
        {
            var category = new AssetCategory
            {
                CategoryName = dto.CategoryName
            };

            await _service.CreateAsync(category);
            return Ok("Category created");
        }

        // PUT: api/AssetCategory/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] AssetCategory category)
        {
            var updated = await _service.UpdateAsync(id, category);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }

        // DELETE: api/AssetCategory/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success)
                return NotFound();
            return NoContent();
        }
    }
}
