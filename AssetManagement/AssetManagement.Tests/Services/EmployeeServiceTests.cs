using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using AssetManagement.Data;
using AssetManagement.Models;
using AssetManagement.Services.Implementations;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class EmployeeServiceTests
    {
        private EFCoreDbContext _context;
        private EmployeeService _service;

        // ──────────────────────────────────────────────────────────────
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<EFCoreDbContext>()
                .UseInMemoryDatabase(databaseName: "EmpDb_" + System.Guid.NewGuid())
                .Options;

            _context = new EFCoreDbContext(options);
            _context.Database.EnsureCreated();

            _service = new EmployeeService(_context);
        }

        // ──────────────────────────────────────────────────────────────
        [Test]
        public async Task GetAllAsync_ReturnsAllEmployees()
        {
            // Arrange
            _context.Employees.AddRange(
                new Employee { EmployeeID = 1, Name = "Asha", Email = "asha@test.com", PasswordHash = "123" },
                new Employee { EmployeeID = 2, Name = "Ravi", Email = "ravi@test.com", PasswordHash = "456" }
            );
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetAllAsync();
            var list = result.ToList();

            // Assert
            Assert.That(list.Count, Is.EqualTo(2));
            Assert.That(list.Any(e => e.Name == "Asha"), Is.True);
        }

        // ──────────────────────────────────────────────────────────────
        [Test]
        public async Task CreateAsync_AddsEmployeeSuccessfully()
        {
            // Arrange
            var newEmp = new Employee
            {
                Name = "Kumar",
                Email = "kumar@test.com",
                PasswordHash = "pwd",
                Role = "Employee"
            };

            // Act
            await _service.CreateAsync(newEmp);
            var afterInsert = await _service.GetAllAsync();

            // Assert
            Assert.That(afterInsert.Any(e => e.Name == "Kumar"), Is.True);
        }

        // ──────────────────────────────────────────────────────────────
        [Test]
        public async Task DeleteAsync_RemovesEmployee()
        {
            // Arrange — seed one employee
            _context.Employees.Add(new Employee { EmployeeID = 99, Name = "Temp", Email = "tmp@test.com", PasswordHash = "tmp" });
            await _context.SaveChangesAsync();

            // Act
            var deleted = await _service.DeleteAsync(99);
            var list = await _service.GetAllAsync();

            // Assert
            Assert.That(deleted, Is.True);
            Assert.That(list.Any(e => e.EmployeeID == 99), Is.False);
        }
        // put this at the end of the class ↓
        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();          // dispose after each test
        }

    }
}
