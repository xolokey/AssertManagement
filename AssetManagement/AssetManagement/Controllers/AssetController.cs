using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetManagement.DTOs;



namespace AssetManagement.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AssetReadDto>>> GetAll()
        {
            try
            {
                var assets = await _assetService.GetAllWithCategoryAsync(); // Include Category

                var dtoList = assets.Select(a => new AssetReadDto
                {
                    AssetID = a.AssetID,
                    AssetNo = a.AssetNo,
                    AssetName = a.AssetName,
                    AssetModel = a.AssetModel,
                    AssetStatus = a.AssetStatus.ToString(),
                    AssetValue = a.AssetValue,
                    ImageURL = a.ImageURL,
                    CategoryName = a.AssetCategory?.CategoryName ?? "Uncategorized"
                });

                return Ok(dtoList);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var asset = await _assetService.GetByIdAsync(id);
                if (asset == null)
                    return NotFound();
                var dto = new AssetReadDto
                {
                    AssetID = asset.AssetID,
                    AssetNo = asset.AssetNo,
                    AssetName = asset.AssetName,
                    AssetModel = asset.AssetModel,
                    AssetStatus = asset.AssetStatus.ToString(),
                    AssetValue = asset.AssetValue,
                    ImageURL = asset.ImageURL,
                    CategoryName = asset.AssetCategory?.CategoryName ?? "Uncategorized"
                };
                return Ok(dto);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(AssetCreateDto dto)
        {
            try
            {
                var asset = new Asset
                {
                    AssetNo = dto.AssetNo,
                    AssetName = dto.AssetName,
                    AssetCategoryID = dto.AssetCategoryID,
                    AssetModel = dto.AssetModel,
                    ManufacturingDate = dto.ManufacturingDate,
                    ExpiryDate = dto.ExpiryDate,
                    AssetValue = dto.AssetValue,
                    AssetStatus = Enum.TryParse<AssetStatus>(dto.AssetStatus, true, out var status)
                                  ? status
                                  : AssetStatus.Available,
                    ImageURL = dto.ImageURL
                };

                await _assetService.CreateAsync(asset);
                return Ok("Asset created");
            } catch (Exception ex) {
                throw new Exception(ex.Message);
            }
        }




        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, Asset asset)
        {
            try
            {
                var updated = await _assetService.UpdateAsync(id, asset);
                return updated == null ? NotFound() : Ok(updated);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _assetService.DeleteAsync(id);
                return deleted ? NoContent() : NotFound();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
