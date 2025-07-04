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
    public class AssetServiceTests
    {
        private EFCoreDbContext _context;
        private AssetService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<EFCoreDbContext>()
                .UseInMemoryDatabase("AssetDb_" + System.Guid.NewGuid())
                .Options;

            _context = new EFCoreDbContext(options);
            _context.Database.EnsureCreated();

            _service = new AssetService(_context);
        }

        // ───────────────────────────────────────────────
        [Test]
        public async Task GetAllWithCategoryAsync_ReturnsAllAssets()
        {
            // arrange
            _context.AssetCategories.Add(new AssetCategory { AssetCategoryID = 1, CategoryName = "Electronics" });
            _context.Assets.AddRange(
                new Asset { AssetID = 1, AssetName = "Laptop", AssetCategoryID = 1 },
                new Asset { AssetID = 2, AssetName = "Monitor", AssetCategoryID = 1 }
            );
            await _context.SaveChangesAsync();

            // act
            var list = (await _service.GetAllWithCategoryAsync()).ToList();

            // assert
            Assert.That(list.Count, Is.EqualTo(2));
            Assert.That(list[0].AssetName, Is.EqualTo("Laptop"));
        }

        // ───────────────────────────────────────────────
        [Test]
        public async Task CreateAsync_AddsAssetSuccessfully()
        {
            // arrange
            _context.AssetCategories.Add(new AssetCategory { AssetCategoryID = 2, CategoryName = "Furniture" });
            await _context.SaveChangesAsync();

            var newAsset = new Asset
            {
                AssetName = "Chair",
                AssetCategoryID = 2,
                AssetStatus = AssetStatus.Available
            };

            // act
            await _service.CreateAsync(newAsset);
            var list = (await _service.GetAllWithCategoryAsync()).ToList();

            // assert
            Assert.That(list.Any(a => a.AssetName == "Chair"), Is.True);
        }
        // put this at the end of the class ↓
        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();          // dispose after each test
        }

    }
}
