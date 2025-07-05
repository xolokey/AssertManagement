using NUnit.Framework;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using AssetManagement.Controllers;
using AssetManagement.DTOs;
using AssetManagement.Models;
using AssetManagement.Services.Interfaces;

namespace AssetManagement.Tests.Controllers
{
    [TestFixture]
    public class AssetControllerTests
    {
        private Mock<IAssetService> _mockAssetService;
        private AssetController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockAssetService = new Mock<IAssetService>();
            _controller = new AssetController(_mockAssetService.Object);
        }

        [Test]
        public async Task GetAll_ReturnsAssetReadDtos_WhenAssetsExist()
        {
            // Arrange
            var assets = new List<Asset>
            {
                new Asset
                {
                    AssetID = 1,
                    AssetNo = "A001",
                    AssetName = "Monitor",
                    AssetModel = "LG-27UL500",
                    AssetStatus = AssetStatus.Available,
                    AssetValue = 15000,
                    ImageURL = "monitor.jpg",
                    AssetCategory = new AssetCategory { CategoryName = "Electronics" }
                }
            };

            _mockAssetService
                .Setup(service => service.GetAllWithCategoryAsync())
                .ReturnsAsync(assets);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var dtoList = okResult.Value as IEnumerable<AssetReadDto>;
            Assert.That(dtoList, Is.Not.Null);
            Assert.That(dtoList.Count(), Is.EqualTo(1));
            Assert.That(dtoList.First().AssetName, Is.EqualTo("Monitor"));
            Assert.That(dtoList.First().CategoryName, Is.EqualTo("Electronics"));
        }
    }
}
