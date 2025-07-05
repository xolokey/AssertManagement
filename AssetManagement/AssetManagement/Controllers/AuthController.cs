using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AssetManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly EFCoreDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthController(
            EFCoreDbContext context,
            IConfiguration config,
            IEmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        /* ───────────────────────────────── LOGIN ───────────────────────────────── */
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest("Email and password are required.");

                var user = await _context.Employees.FirstOrDefaultAsync(e =>
                    e.Email == request.Email && e.PasswordHash == request.Password);

                if (user == null) return Unauthorized("Invalid credentials");

                // Generate JWT Token
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
                var token = new JwtSecurityTokenHandler().CreateEncodedJwt(new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                    new Claim(ClaimTypes.Name,           user.Name),
                    new Claim(ClaimTypes.NameIdentifier, user.EmployeeID.ToString()),
                    new Claim(ClaimTypes.Email,          user.Email),
                    new Claim(ClaimTypes.Role,           user.Role ?? "Employee")
                }),
                    Expires = DateTime.UtcNow.AddHours(2),
                    Issuer = _config["Jwt:Issuer"],
                    Audience = _config["Jwt:Issuer"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                });

                // Login history
                _context.LoginHistories.Add(new LoginHistory
                {
                    UserID = user.EmployeeID,
                    LoginTime = DateTime.Now,
                    JWTToken = token
                });
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    token,
                    user = new { user.EmployeeID, user.Name, user.Email, user.Role }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        /* ───────────────────────────── FORGOT PASSWORD ─────────────────────────── */
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.Email))
                    return BadRequest("Email is required.");

                var user = await _context.Employees.FirstOrDefaultAsync(e => e.Email == req.Email);
                if (user == null) return BadRequest("Account not found.");

                var token = Guid.NewGuid().ToString();
                user.ResetToken = token;
                user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);
                await _context.SaveChangesAsync();

                var link = $"http://localhost:3000/reset-password?token={token},http://localhost:5173/reset-password?token={token}";
                await _emailService.SendEmailAsync(user.Email,
                    "HexaTrack Password Reset",
                    $"<p>Hello {user.Name},</p><p>Click the link below to reset your password:</p><p><a href=\"{link}\">Reset Password</a></p><p>This link expires in 1 hour.</p>");

                return Ok("Password‑reset link sent to your email.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }

        /* ───────────────────────────── RESET PASSWORD ──────────────────────────── */
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.Token) || string.IsNullOrWhiteSpace(req.NewPassword))
                    return BadRequest("Token and new password are required.");

                var user = await _context.Employees.FirstOrDefaultAsync(e => e.ResetToken == req.Token);
                if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
                    return BadRequest("Invalid or expired token.");

                user.PasswordHash = req.NewPassword;          // 🔒 hash in real app
                user.ResetToken = null;
                user.ResetTokenExpiry = null;
                await _context.SaveChangesAsync();

                return Ok("Password has been reset. Please log in with your new password.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }
    }

    /* ─────────── DTOs ─────────── */
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
