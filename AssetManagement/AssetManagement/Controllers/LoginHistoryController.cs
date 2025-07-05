using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AssetManagement.DTOs;

namespace AssetManagement.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class LoginHistoryController : ControllerBase
    {
        private readonly ILoginHistoryService _service;

        public LoginHistoryController(ILoginHistoryService service)
        {
            _service = service;
        }

        // GET: api/LoginHistory
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var logs = await _service.GetAllAsync();

                var dtoList = logs.Select(l => new LoginHistoryReadDto
                {
                    LoginID = l.LoginID,
                    UserName = l.User?.Name ?? $"User {l.UserID}",
                    LoginTime = l.LoginTime,
                    LogoutTime = l.LogoutTime,
                    JwtToken = l.JWTToken
                });

                return Ok(dtoList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // GET: api/LoginHistory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var log = await _service.GetByIdAsync(id);
                if (log == null) return NotFound();

                var dto = new LoginHistoryReadDto
                {
                    LoginID = log.LoginID,
                    UserName = log.User?.Name ?? $"User {log.UserID}",
                    LoginTime = log.LoginTime,
                    LogoutTime = log.LogoutTime,
                    JwtToken = log.JWTToken
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // POST: api/LoginHistory
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoginHistoryCreateDto dto)
        {
            try
            {
                var login = new LoginHistory
                {
                    UserID = dto.UserID,
                    LoginTime = dto.LoginTime,
                    LogoutTime = dto.LogoutTime,
                    JWTToken = dto.JwtToken
                };

                var created = await _service.CreateAsync(login);
                return CreatedAtAction(nameof(GetById), new { id = created.LoginID }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // PUT: api/LoginHistory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LoginHistory login)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, login);
                return updated == null ? NotFound() : Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        // DELETE: api/LoginHistory/{id}
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
    }
}
